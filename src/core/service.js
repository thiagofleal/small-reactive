import { Subject } from "../../rx.js";
import { Module } from "./module.js";

export class Service {
  #module = null;

  constructor(context) {
    if (!context) context = {};
    if (!(context.module instanceof Module)) {
      throw new Error("Invalid module");
    }
    this.#module = context.module;
    this.events$ = new Subject();

    this.notify({
      event: "create",
      instance: this,
      context
    });
  }

  onRegister() { }

  onImport() { }

  onGet() { }

  notify(event) {
    this.events$.next(event);
  }

  events() {
    return this.events$;
  }

  inject(service) {
    const module = this.#module;

    if (module) {
      return module.inject(service);
    }
  }
}
