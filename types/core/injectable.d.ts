import { Constructable } from "../utils/constructable";
import { Module } from "./module";
import { Service } from "./service";

export type InjectableInitializeObject = { service: Constructable<Service>, args?: any };
export type InjectableInitialize = Constructable<Service> | InjectableInitializeObject;

export class Injectable {
  static registerIn<T extends Service>(classRef: Constructable<T>, from: Module, args: any): void;
  static registerInstanceIn<T extends Service>(instance: T, from: Module): void;
  static getFrom<T extends Service>(classRef: Constructable<T>, from: Module): T | undefined;
  static register<T extends Service>(classRef: Constructable<T>, args: any): void;
  static registerInstance<T extends Service>(instance: T): void;
  static get<T extends Service>(classRef: Constructable<T>): T | undefined;
}
