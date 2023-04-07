import { Constructable } from "../utils/constructable";
import { Service } from "./service";

export class Injectable {
  static register<T extends Service>(classRef: Constructable<T>, ...args: any[]): void;
  static get<T extends Service>(classRef: Constructable<T>): T | null;
}
