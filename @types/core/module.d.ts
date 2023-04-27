import { Constructable } from "../utils/constructable";
import { Component } from "./component";
import { Service } from "./service";

export class Module {
  constructor(options?: {
    components?:  Component[]
    imports?:     Module[]
    inject?:      (Constructable<Service>[] | {
      service:    Constructable<Service>[]
      args?:      any
    })[]
  })
  static register(module: Module): void
  static getFromComponent(component: Component): Module | undefined
  inject<T extends Service>(service: Constructable<T>): T | undefined
}
