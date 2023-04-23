import { Injectable } from "./injectable.js";

export class Module {
  static #modules = {};
  static #mapComponents = {};

  injectables = [];
  components = [];

  constructor(options) {
    if (!options) options = {};
    if (options.components) {
      if (!Array.isArray(options.components)) {
        options.components = [ options.components ];
      }
      this.components = options.components;
    }
    if (options.inject) {
      if (!Array.isArray(options.inject)) {
        options.inject = [ options.inject ];
      }
      this.injectables = options.inject;
    }
  }

  static register(module, ...args) {
    const instance = new module(...args);

    this.#modules[module] = instance;

    instance.components.forEach(component => {
      this.#mapComponents[component] = instance;
    });
    instance.injectables.forEach(injectable => {
      Injectable.registerIn(injectable, instance);
    });
  }

  static getFromComponent(component) {
    return this.#mapComponents[component];
  }

  inject(service) {
    return Injectable.getFrom(service, this) || Injectable.get(service);
  }
}
