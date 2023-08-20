import { Subject } from "../../rx.js";
import { Module } from "./module.js";

export class Service {
  constructor() {
    this.events$ = new Subject();
    this.notify({
      event: "create"
    });
  }

  onRegister() { }

  onGet() { }

  notify(event) {
    this.events$.next(event);
  }

  events() {
    return this.events$;
  }

  inject(service) {
    const module = Module.getFromInjectable(this.constructor);

    if (module) {
      return module.inject(service);
    }
  }
}
