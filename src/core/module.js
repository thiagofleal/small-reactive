import { Service } from "./service.js";

export class Module {
  static global = new Module();

  static #mapComponents = new Map();
  static #mapDirectives = new Map();
  static #mapInjectables = new Map();

  #instanceInjectables = new Map();
  #instanceModules = [];
  #exports = [];

  constructor(options) {
    let injectables = [];
    let components = [];
    let directives = [];
    let modules = [];

    if (!options) options = {};
    if (options.components) {
      if (!Array.isArray(options.components)) {
        options.components = [ options.components ];
      }
      components = options.components;
    }
    if (options.directives) {
      if (!Array.isArray(options.directives)) {
        options.directives = [ options.directives ];
      }
      directives = options.directives;
    }
    if (options.inject) {
      if (!Array.isArray(options.inject)) {
        options.inject = [ options.inject ];
      }
      injectables = options.inject;
    }
    if (options.imports) {
      if (!Array.isArray(options.imports)) {
        options.imports = [ options.imports ];
      }
      modules = options.imports;
    }
    if (options.exports) {
      if (!Array.isArray(options.exports)) {
        options.exports = [ options.exports ];
      }
      this.#exports = options.exports;
    }
    components.forEach(e => this.registerComponent(e));
    directives.forEach(e => this.registerDirective(e));
    injectables.forEach(e => this.registerInjectable(e));
    modules.forEach(e => this.registerChild(e));
  }

  registerComponent(component) {
    Module.#mapComponents.set(component, this);
  }

  registerDirective(directive) {
    Module.#mapDirectives.set(directive, this);
  }

  registerInjectable(ref, arg) {
    let inject = null;
    let clazz = null;

    if (ref instanceof Service) {
      inject = ref;
      clazz = inject.constructor;
    } else if (typeof ref === "object") {
      return this.registerInjectable(ref.service, ref.args);
    } else if (typeof ref === "function") {
      try {
        inject = new ref(arg);
        clazz = ref;
      } catch (e) {
        inject = ref(arg);
        clazz = inject.constructor;
      }
    }
    if (inject && clazz) {
      this.#instanceInjectables.set(clazz, inject);
      Module.#mapInjectables.set(clazz, this);
      inject.notify({
        event: "inject",
        target: clazz
      });
      inject.onRegister();
    }
  }

  registerChild(ref, arg) {
    let module = null;

    if (ref instanceof Module) {
      module = ref;
    } else if (typeof ref === "object") {
      return this.registerChild(ref.module, ref.args);
    } else if (typeof ref === "function") {
      try {
        module = new ref(arg);
      } catch (e) {
        module = ref(arg);
      }
    }
    if (module instanceof Module) {
      this.#instanceModules.push(module);
      module.getExported().forEach(e => this.registerInjectable(e));
    }
  }

  static register(ref, arg) {
    this.global.registerChild(ref, arg);
  }

  static getFromComponent(component) {
    return this.#mapComponents.get(component) || this.global;
  }

  static getFromDirective(directive) {
    return this.#mapDirectives.get(directive) || this.global;
  }

  static getFromInjectable(inject) {
    return this.#mapInjectables.get(inject) || this.global;
  }

  getExported() {
    return this.#exports.map(e => this.#get(e));
  }

  #get(service) {
    const ret = this.#instanceInjectables.get(service);

    if (!ret && this !== Module.global) {
      return Module.global.#get(service);
    }
    if (ret) ret.onGet();
    return ret;
  }

  inject(service) {
    return this.#get(service);
  }
}
