import { Subject } from "../rx/subject.js";

export class Service {
  constructor() {
    this.events$ = new Subject();
  }

  onRegister() { }

  onGet() { }

  notify(event) {
    this.events$.next(event);
  }

  events() {
    return this.events$;
  }
}
