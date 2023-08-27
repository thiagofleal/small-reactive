import { Module } from "./module.js";

export class Injectable {
  static registerIn(classRef, from, args) {
    if (from instanceof Module) {
      from.registerInjectable(classRef, args);
    }
  }

  static getFrom(classRef, from) {
    return from.inject(classRef);
  }

  static register(classRef, args) {
    this.registerIn(classRef, Module.global, args);
  }

  static get(classRef) {
    return this.getFrom(classRef, Module.global);
  }
}
