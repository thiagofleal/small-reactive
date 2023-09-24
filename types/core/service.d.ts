import { Observable } from "../../rx";
import { Constructable } from "../utils/constructable";
import { Module } from "./module";

export interface OnRegister {
  onRegister(module?: Module): void | Promise<void>;
}

export interface OnImport {
  onImport(module?: Module): void | Promise<void>;
}

export class Service<T = any> {
  constructor(context: unknown);

  onGet?(): void;

  notify(event: T): void;
  events(): Observable<T>;
  inject<U extends Service>(classRef: Constructable<U>): U | undefined;
}
