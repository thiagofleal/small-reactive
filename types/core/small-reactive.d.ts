import { Constructable } from "../utils/constructable";
import { Component } from "./component"
import { Service } from "./service";
import { Module } from "./module";

type ConstructableOrPromise<T> = Constructable<T> | Promise<Constructable<T>>;

type StartOptions = {
  target:     HTMLElement | string,
  component:  Constructable<Component> | Component | ((...args?: any[]) => Component),
  modules?:   (ConstructableOrPromise<Module> | {
    module:   ConstructableOrPromise<Module>
    args?:    any
  })[],
  inject?:    (ConstructableOrPromise<Service> | {
    service:  ConstructableOrPromise<Service>
    args?:    any
  })[]
};

export class SmallReactive {
  static start(opts: StartOptions, ...args: any[]): Promise<void>;
}
