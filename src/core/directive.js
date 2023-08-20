import { Module, Injectable } from "../../core.js";

export class Directive {
  #component = null;

  constructor() {}

  setComponent(component) {
    this.#component = component;
  }

  get component() {
    return this.#component;
  }

  apply(element, value, component) {}

  init(element, selector) {
    if (element instanceof HTMLElement && typeof selector === "string") {
      const value = element.getAttribute(selector);
      this.apply(element, value, this.component);
    }
  }

  inject(service) {
    const module = Module.getFromDirective(this.constructor);

    if (module) {
      return module.inject(service);
    }
    return Injectable.get(service);
  }
}
