import { getAllAttributesFrom, randomString } from "../utils/functions.js";
import { VirtualDom } from "../utils/virtual-dom.js";
import { BehaviorSubject, map, Subscription } from "../../rx.js";
import { Style } from "./style.js";
import { Module } from "./module.js";
import { Injectable } from "./injectable.js";

export class Component {
  #properties = {};
  #element = [];
  #componentChildren = [];
  #onShowCallbacks = [];
  #onReloadCallbacks = [];
  #inUse = false;
  #id = null;
  #children = null;
  #children$ = new BehaviorSubject([]);
  #components$ = new BehaviorSubject([]);
  #styles = [];
  #deepStyles = [];
  #subscription = new Subscription();

  constructor(options) {
    this.#id = randomString(15);

    if (options) {
      if (options.children) {
        this.setChildren(options.children);
      }
      if (options.style) {
        if (!Array.isArray(options.style)) {
          options.style = [ options.style ];
        }
        options.style.forEach(style => this.useStyle(style));
      }
      if (options.deepStyle) {
        if (!Array.isArray(options.deepStyle)) {
          options.deepStyle = [ options.deepStyle ];
        }
        options.deepStyle.forEach(deepStyle => this.useDeepStyle(deepStyle));
      }
    }
  }

  get element() {
    return this.#element;
  }

  get children() {
    return this.#children;
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
      document.head.querySelectorAll(`style[component="${this.#id}"]`).forEach(e => e.remove());
      this.onDisconnect();
      this.#subscription.unsubscribe();
      return false;
    }
    return true;
  }
  #setChildren(children) {
    this.#children = children;
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

  #isToIgnore(element) {
    return this.#componentChildren.map(e => e.selector).some(e => element.matches(e));
  }

  #assignComponent(item) {
    if (item instanceof HTMLElement) {
      if (!this.#isToIgnore(item)) {
        item.component = this;
        item.childNodes.forEach(child => this.#assignComponent(child));
      }
    }
  }

  #bindEvents(element) {
    if (element instanceof HTMLElement) {
      const attributes = getAllAttributesFrom(element);
      if (!element.initiated) {
        const prefix = "event:";

        for (const key in attributes) {
          if (key.startsWith(prefix)) {
            const event = key.substring(prefix.length);
            element.addEventListener(event, event => {
              new Function("event", "element", attributes[key]).call(this, event, element);
            });
          }
        }
        if (element.component) {
          const prefix = "bind:";

          for (const key in attributes) {
            if (key.startsWith(prefix)) {
              this.#onReloadCallbacks.push(() => {
                const property = key.substring(prefix.length);
                element.componentInstance[property] = new Function(`return ${ attributes[key] }`)
                  .call(this);
              });
            }
          }
        }
        element.initiated = true;
      }
      if (!this.#isToIgnore(element)) {
        element.childNodes.forEach(e => this.#bindEvents(e));
      }
    }
  }

  #initProperties(props) {
    Object.keys(this).forEach(key => {
      props[key] = this[key];
      delete this[key];
    });
    if (props && typeof props === "object") {
      for (const key in props) {
        this.#properties[key] = props[key];
        Object.defineProperty(this, key, {
          get: () => this.#properties[key],
          set: value => {
            if (this.#properties[key] !== value) {
              this.#properties[key] = value;
              this.reload();
            }
          }
        });
      }
    }
  }

  show(element) {
    this.#initProperties({});
    this.#element = element;
    this.reload();
    if (!element.component) {
      this.#assignComponent(element);
      this.#styles.forEach(style => {
        Style.create(style, {
          prefix: "",
          posfix: `[component=${this.#id}]`
        }, {
          component: this.#id
        });
      })
      this.#deepStyles.forEach(style => {
        Style.create(style, [
          {
            prefix: "",
            posfix: `[component=${this.#id}]`
          },
          {
            prefix: `[component=${this.#id}] `,
            posfix: ""
          }
        ], {
          component: this.#id
        });
      });
      this.onConnect();
    }
    this.#onShowCallbacks.forEach(e => e());
    this.onShow();
  }

	useStyle(style) {
    this.#styles.push(style);
	}

	useDeepStyle(style) {
    this.#deepStyles.push(style);
	}

  appendChild(selector, component) {
    this.#componentChildren.push({ selector, component, instances: [] });
  }

  setChildren(children) {
    if (typeof children === "object") {
      if (Array.isArray(children)) {
        children.forEach(e => this.appendChild(e.selector, e.component));
      } else {
        for (const key in children) {
          this.appendChild(key, children[key]);
        }
      }
    }
  }

  observeChildren(ref) {
    return this.observeChildrenSelector(`[ref="${ref}"]`);
  }

  observeChildrenSelector(selector) {
    return this.#children$.pipe(map(e => e.filter(i => i.matches(selector))));
  }

  observeChildrenComponents(ref) {
    return this.#components$.pipe(map(e => e.filter(i => i.element.matches(`[ref="${ref}"]`))));
  }

  #childrenReference(refs, map) {
    Object.keys(refs).forEach(key => {
      const name = key;
      const ref = refs[key];
      let value = null;
      this.#subscription.add(
        this.observeChildrenComponents(ref).subscribe(i => value = map(i))
      );
      Object.defineProperty(this, name, {
        get: () => value
      });
    });
  }

  childrenReference(refs) {
    this.#childrenReference(refs, i => {
      return (i || []).map(e => e.component);
    });
  }

  childReference(refs) {
    this.#childrenReference(refs, i => {
      return i[0] ? i[0].component : undefined;
    });
  }

  eventEmitter(event) {
    return {
      emit: data => {
        this.emit(event, data);
      }
    };
  }

  emit(event, data) {
    if (!data) data = {};
    if (!data.detail) {
      data = { detail: data };
    }
    this.#element.dispatchEvent(new CustomEvent(event, data))
  }

  inject(service) {
    const module = Module.getFromComponent(this.constructor);

    if (module) {
      return module.inject(service);
    }
    return Injectable.get(service);
  }

  reload() {
    const template = this.render(this.#element);
    const vDom = new VirtualDom();
    vDom.load(template);
    vDom.ignore = this.#componentChildren.map(e => e.selector);
    const changes = vDom.apply(this.#element, {
      component: this.#id
    });

    if (changes) {
      const children = [];
      this.#componentChildren.forEach(child => {
        const { selector, component, instances } = child;
        instances.forEach(e => {
          if (e instanceof Component) {
            e.#resetInUse();
          }
        });
        const elements = vDom.template.querySelectorAll(selector);
        this.#element.querySelectorAll(selector).forEach((element, index) => {
          const instance = this.#instanceComponent(element, component);
          if (instance) {
            if (!instances.includes(instance)) {
              instances.push(instance);
            }
            instance.#setChildren(elements[index]);
            instance.#markAsInUse();
            instance.show(element);
            element.componentInstance = instance;
            children.push({
              element, component: instance
            });
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
      this.#children$.next(Array.from(vDom.template.querySelectorAll(`[component="${this.#id}"]`)));
      this.#components$.next(Array.from(children));
      this.element.childNodes.forEach(e => this.#bindEvents(e));
    }
    this.#onReloadCallbacks.forEach(e => e());
    this.onReload();
  }
}
