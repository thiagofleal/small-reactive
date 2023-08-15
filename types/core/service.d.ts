import { Observable } from "../../rx";
import { Constructable } from "../utils/constructable";

export class Service<T = any> {
  constructor();

  onRegister?(): void;
  onGet?(): void;

  notify(event: T): void;
  events(): Observable<T>;
  inject<U extends Service>(classRef: Constructable<U>): U | undefined;
}
