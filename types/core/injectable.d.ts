import { Constructable } from "../utils/constructable";
import { Service } from "./service";

export type InjectableInitializeObject = { service: Constructable<Service>, args?: any };
export type InjectableInitialize = Constructable<Service> | InjectableInitializeObject;

export class Injectable {
  static registerIn<T extends Service>(classRef: Constructable<T>, from: any, args: any): void;
  static getFrom<T extends Service>(classRef: Constructable<T>, from: any): T | undefined;
  static register<T extends Service>(classRef: Constructable<T>, args: any): void;
  static get<T extends Service>(classRef: Constructable<T>): T | undefined;
}
