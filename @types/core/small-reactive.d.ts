import { Component } from "./component"
import { Constructable } from "../utils/constructable";
import { Service } from "./service";

type StartOptions = {
  target:     HTMLElement | string,
  component:  Constructable<Component> | Component | (() => Component),
  inject?:    Constructable<Service>[]
};

export class SmallReactive {
  static start(opts: StartOptions, ...args: any[]): Promise<void>;
}
