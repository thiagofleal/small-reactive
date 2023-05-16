import { Observable } from "../rx/observable";

export class Service<T = any> {
  constructor();

  onRegister?(): void;
  onGet?(): void;

  notify(event: T): void;
  events(): Observable<T>;
}
