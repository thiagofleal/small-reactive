import { Component } from "../../src/core/component";

export class Directive {
  constructor();
  get component(): Component | undefined;
  setComponent(component?: Component): void;
  init(element: HTMLElement, selector: string): void;
  apply(): void;
  apply(element: HTMLElement): void;
  apply(element: HTMLElement, value: string): void;
  apply(element: HTMLElement, value: string, component: Component): void;
}
