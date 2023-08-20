import { Module } from "./module";

export class Injectable {
  static registerIn(classRef, from, args) {
    from.registerChild(classRef, args);
  }

  static registerInstanceIn(instance, from) {
    from.registerChild(instance);
  }

  static getFrom(classRef, from) {
    return from.inject(classRef);
  }

  static register(classRef, args) {
    this.registerIn(classRef, Module.global, args);
  }

  static registerInstance(instance) {
    this.registerInstanceIn(instance, Module.global);
  }

  static get(classRef) {
    return this.getFrom(classRef, Module.global);
  }
}
