import { Constructable } from "../utils/constructable";
import { Component } from "./component";
import { Directive } from "./directive";
import { InjectableInitialize } from "./injectable";
import { Service } from "./service";

export type ModuleInitializeObject = { module: Constructable<Module>, args?: any };
export type ModuleInitialize = Constructable<Module> | ModuleInitializeObject | (() => Module);

export class Module {
  constructor(options?: {
    components?:  Constructable<Component>[]
    directives?:  Constructable<Directive>[]
    imports?:     ModuleInitialize[]
    inject?:      InjectableInitialize[]
  })
  static register(
    module: ModuleInitialize,
    args?:  any
  ): void
  static getFromComponent(component: Component): Module | undefined
  static getFromDirective(directive: Directive): Module | undefined
  inject<T extends Service>(service: Constructable<T>): T | undefined
}
