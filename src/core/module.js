import { Injectable } from "./injectable.js";

export class Module {
  static #modules = {};
  static #mapComponents = {};

  injectables = [];
  components = [];
  modules = [];

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
    if (options.imports) {
      if (!Array.isArray(options.imports)) {
        options.imports = [ options.imports ];
      }
      this.modules = options.imports.map(e => Module.#modules[e]);
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

  getFromImports(service) {
    for (let i = 0; i < this.modules.length; i++) {
      const module = this.modules[i];
      const instance = Injectable.getFrom(service, module);

      if (instance) {
        return instance;
      }
    }
  }

  inject(service) {
    return Injectable.getFrom(service, this)
    || this.getFromImports(service)
    || Injectable.get(service);
  }
}
