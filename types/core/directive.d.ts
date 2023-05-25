import { Component } from "../../src/core/component";
import { Constructable } from "../utils/constructable";
import { Service } from "./service";

export class Directive {
  constructor();
  get component(): Component | undefined;
  setComponent(component?: Component): void;
  inject<T extends Service>(classRef: Constructable<T>): T | undefined;
  init(element: HTMLElement, selector: string): void;
  apply(): void;
  apply(element: HTMLElement): void;
  apply(element: HTMLElement, value: string): void;
  apply(element: HTMLElement, value: string, component: Component): void;
}
