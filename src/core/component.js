import { parseHTML } from "../utils/functions.js";
import { diff } from "../utils/virtual-dom.js";

export class Component {
  #properties = {};
  #elements = [];
  #currentElement = null;
  #childs = [];
  #onShowCallbacks = [];

  constructor(props, options) {
    if (props && typeof props === "object") {
      for (const key in props) {
        this.#properties[key] = props[key];
        Object.defineProperty(this, key, {
          get: () => this.#properties[key],
          set: value => {
            this.#properties[key] = value;
            this.reload();
          }
        })
      }
    }
  }

  render() { return ""; }
  onShow() {}
  onReload() {}

  show(elements) {
    if (!Array.isArray(elements)) {
      elements = [ elements ];
    }
    this.#elements = elements;
    this.reload();
    this.#onShowCallbacks.forEach(e => e());
    this.onShow();
  }

  appendChild(component, selector) {
    if (component instanceof Component) {
      this.#childs.push(component);
      this.#onShowCallbacks.push(() => {
        const elements = this.#currentElement.querySelectorAll(selector);
        component.show(Array.prototype.slice.call(elements));
      });
    }
  }

  #assignComponent(item) {
    item.childNodes.forEach(child => {
      child._component = this;
      child._element = this.#currentElement;
      if (!child.component) {
        Object.defineProperty(child, "component", {
          get: () => {
            this.#currentElement = child._element;
            return child._component;
          }
        });
      }
      this.#assignComponent(child);
    });
  }

  reload() {
    this.#elements.forEach(element => {
      this.#currentElement = element;
      const templateHTML = this.render(element);
      const template = parseHTML(templateHTML);
      diff(template, element);
      this.#assignComponent(element);
      this.#childs.forEach(child => child.reload());
    });
    this.onReload();
  }
}
