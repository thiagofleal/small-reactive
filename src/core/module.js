import { Injectable } from "./injectable.js";

export class Module {
  static #modules = new Map();
  static #mapComponents = new Map();
  static #mapDirectives = new Map();
  static #mapInjectables = new Map();

  injectables = [];
  components = [];
  directives = [];
  modules = [];

  constructor(options) {
    if (!options) options = {};
    if (options.components) {
      if (!Array.isArray(options.components)) {
        options.components = [ options.components ];
      }
      this.components = options.components;
    }
    if (options.directives) {
      if (!Array.isArray(options.directives)) {
        options.directives = [ options.directives ];
      }
      this.directives = options.directives;
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
      this.modules = options.imports.map(e => Module.#modules.get(e));
    }
  }

  static register(module, ...args) {
    let instance;

    if (module instanceof Module) {
      instance = module;
    }
    if (typeof module === "function") {
      try {
        instance = new module(...args);
      } catch (e) {
        instance = module(...args);
      }
    }
    this.#modules.set(module.constructor, instance);

    instance.components.forEach(component => {
      this.#mapComponents.set(component, instance);
    });
    instance.directives.forEach(directivet => {
      this.#mapDirectives.set(directivet, instance);
    });
    instance.injectables.forEach(injectable => {
      this.#mapInjectables.set(injectable, instance);
      Injectable.registerIn(injectable, instance);
    });
  }

  static getFromComponent(component) {
    return this.#mapComponents.get(component);
  }

  static getFromDirective(directive) {
    return this.#mapDirectives.get(directive);
  }

  static getFromInjectable(inject) {
    return this.#mapInjectables.get(inject);
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
