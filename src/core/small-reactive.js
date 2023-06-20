import { Component } from "./component.js";
import { Injectable } from "./injectable.js";
import { Module } from "./module.js";

export class SmallReactive {
  static async start(opts, ...args) {
    let { target, component, modules, inject } = opts;

		if (Array.isArray(modules)) {
      const allModules = await Promise.all(modules.map(async module => {
				if (module instanceof Promise) {
					module = await module;
				}
        return module;
      }));
      allModules.forEach(module => {
        if (typeof module === "function") {
          Module.register(module);
        }
      });
		}
		if (Array.isArray(inject)) {
      const services = await Promise.all(inject.map(async service => {
				if (service instanceof Promise) {
					service = await service;
				}
        return service;
      }));
      services.forEach(service => {
        Injectable.register(service);
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
        component.showComponentInElement(target);
      }
    }
  }
}
