import { getAllAttributesFrom, randomString } from "../utils/functions.js";
import { VirtualDom } from "../utils/virtual-dom.js";

export class Component {
  #properties = {};
  #element = [];
  #childs = [];
  #onShowCallbacks = [];
  #inUse = false;
  #id = null;

  constructor(props) {
    if (props && typeof props === "object") {
      for (const key in props) {
        this.#properties[key] = props[key];
        Object.defineProperty(this, key, {
          get: () => this.#properties[key],
          set: value => {
            this.#properties[key] = value;
            this.reload();
          }
        });
      }
    }
    this.#id = randomString(15);
  }

  get element() {
    return this.#element;
  }

  render() { return ""; }
  onShow() {}
  onReload() {}
  onConnect() {}
  onDisconnect() {}

  #markAsInUse() {
    this.#inUse = true;
  }
  #resetInUse() {
    this.#inUse = false;
  }
  #checkInUse() {
    if (!this.#inUse) {
      this.onDisconnect();
      return false;
    }
    return true;
  }

  #instanceComponent(element, seed, ...args) {
    let instance = seed;

    if (element && element.component) {
      if (element.component instanceof Component) {
        return element.component;
      }
    }
    if (typeof seed === "function") {
      try {
        instance = new seed(...args);
      } catch (e) {
        instance = seed(...args);
      }
    }
    if (instance instanceof Component) {
      return instance;
    }
    return null;
  }

  #bindEvents(element) {
    if (element instanceof HTMLElement) {
      const attributes = getAllAttributesFrom(element);
      const prefix = "event:";

      for (const key in attributes) {
        if (key.startsWith(prefix)) {
          const event = key.substring(prefix.length);
          element.addEventListener(event, event => {
            new Function("event", attributes[key]).call(this, event);
          });
        }
      }
      element.childNodes.forEach(e => this.#bindEvents(e));
    }
  }

  show(element) {
    this.#element = element;
    this.reload();
    this.#assignComponent(element);
    this.#bindEvents(element);
    if (!element.component) {
      element.component = this;
      this.onConnect();
    }
    this.#onShowCallbacks.forEach(e => e());
    this.onShow();
  }

  appendChild(selector, component) {
    this.#childs.push({ selector, component, instances: [] });
  }

  setChilds(childs) {
    if (typeof childs === "object") {
      if (Array.isArray(childs)) {
        childs.forEach(e => this.appendChild(e.selector, e.component));
      } else {
        for (const key in childs) {
          this.appendChild(key, childs[key]);
        }
      }
    }
  }

  #assignComponent(item) {
    (item.childNodes || []).forEach(child => {
      child._component = this;
      child._element = this.#element;
      if (!child.component) {
        Object.defineProperty(child, "component", {
          get: () => {
            this.#element = child._element;
            return child._component;
          }
        });
      }
      this.#assignComponent(child);
    });
  }

  reload() {
    const template = this.render(this.#element);
    const vDom = new VirtualDom();
    vDom.load(template);
    vDom.ignore = this.#childs.map(e => e.selector);
    vDom.apply(this.#element);
    this.#childs.forEach(child => {
      const { selector, component, instances } = child;
      instances.forEach(e => {
        if (e instanceof Component) {
          e.#resetInUse();
        }
      });
      this.#element.querySelectorAll(selector).forEach(element => {
        const instance = this.#instanceComponent(element, component);
        if (instance) {
          if (!instances.includes(instance)) {
            instances.push(instance);
          }
          instance.#markAsInUse();
          instance.show(element);
        }
      });
      const remove = [];
      instances.forEach((e, i) => {
        if (e instanceof Component) {
          if (!e.#checkInUse()) {
            remove.push(i);
          }
        }
      });
      remove.forEach(i => instances.splice(i, 1));
    });
    this.onReload();
  }
}
