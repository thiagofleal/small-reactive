import { getAllAttributesFrom } from "../utils/functions.js";
import { Component } from "./component.js";

export class Switch extends Component {
  #components = {};
  #selectedKey = void 0;

  get selected() {
    return this.#selectedKey ? this.#components[this.#selectedKey] : void 0;
  }

  get keys() {
    return Object.keys(this.#components);
  }

  #getSelectorFromKey(key) {
    return `switch-${ key.replace(/[^A-Za-z0-9]/gi, "-").replace(/^\-/, "") }`;
  }

  constructor(options) {
    super(options);
  }

  onConnect() {
    if (this.parent) {
      this.setContext(this.parent);
    }
  }

  setComponent(key, component) {
    if (component instanceof Component) {
      this.#components[key] = component;
      this.appendChild(this.#getSelectorFromKey(key), component);
    }
  }
  
  select(key) {
    if (this.keys.includes(key)) {
      this.#selectedKey = key;
    }
    this.reload();
  }

  render() {
    const key = this.#selectedKey;

    if (key) {
      const selector = this.#getSelectorFromKey(key);
      const allAttributes = getAllAttributesFrom(this.element);
      const attributes = Object.keys(allAttributes)
        .map(key => `${ key }="${ allAttributes[key] }"`)
        .join(" ");
  
      return `<${ selector } ${ attributes }></${ selector }>`;
    }
    return "";
  }
}
