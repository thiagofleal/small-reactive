import { Component } from "./component.js";
import { Injectable } from "./injectable.js";
import { Service } from "./service.js";

export class SmallReactive {
  static async start(opts, ...args) {
    let { target, component, inject } = opts;

		if (Array.isArray(inject)) {
      const services = await Promise.all(inject.map(async service => {
				if (service instanceof Promise) {
					service = await service;
				}
        return service;
      }));
      services.forEach(service => {
        if (typeof service === "function") {
          Injectable.register(service);
        }
      });
		}
    if (component instanceof Promise) {
      component = await component;
    }
    if (typeof component === "function") {
      try {
        component = new component(...args);
      } catch (e) {
        component = component(...args);
      }
    }
    if (component instanceof Promise) {
      component = await component;
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
