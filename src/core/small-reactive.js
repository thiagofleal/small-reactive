import { Component } from "./component.js";

export class SmallReactive {
  static start(opts, ...args) {
    let { target, component } = opts;

    if (typeof component === "function") {
      try {
        component = new component(...args);
      } catch (e) {
        component = component(...args);
      }
    }
    if (component instanceof Component) {
      if (typeof target === "string") {
        target = document.querySelector(target);
      }
      if (target instanceof HTMLElement) {
        component.show(target);
      }
    }
  }
}