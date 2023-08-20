import { Constructable } from "../utils/constructable";
import { Component } from "./component";
import { Directive } from "./directive";
import { InjectableInitialize } from "./injectable";
import { Service } from "./service";

export type ModuleInitializeObject = { module: Constructable<Module>, args?: any };
export type ModuleInitialize = Constructable<Module> | ModuleInitializeObject | (() => Module);

export class Module {
  static readonly global: Module;

  constructor(options?: {
    components?:  Constructable<Component>[]
    directives?:  Constructable<Directive>[]
    inject?:      InjectableInitialize[]
    imports?:     ModuleInitialize[]
    exports?:     Constructable<Service>[]
  })

  static register(
    module: ModuleInitialize,
    args?:  any
  ): void
  static getFromComponent(component: Constructable<Component>): Module
  static getFromDirective(directive: Constructable<Directive>): Module
  static getFromInjectable(service: Constructable<Service>): Module

  registerComponent(component: Constructable<Component>): void
  registerDirective(directive: Constructable<Directive>): void
  registerInjectable(
    ref: Service | Constructable<Service> | (() => Service),
    arg?: any
  ): void
  registerChild(
    ref: Module | Constructable<Module> | (() => Module),
    arg?: any
  ): void

  inject<T extends Service>(service: Constructable<T>): T | undefined
  getExported(): Service[]
}

