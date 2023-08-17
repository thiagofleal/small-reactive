import { Constructable } from "../utils/constructable";
import { Component } from "./component"
import { ModuleInitialize } from "./module";
import { InjectableInitialize } from "./injectable";

type ConstructableOrPromise<T> = Constructable<T> | Promise<Constructable<T>>;

type StartOptions = {
  target:     HTMLElement | string,
  component:  Constructable<Component> | Component | ((...args: any[]) => Component),
  modules?:   ModuleInitialize[],
  inject?:    InjectableInitialize[]
};

export class SmallReactive {
  static start(opts: StartOptions, ...args: any[]): Promise<void>;
}
