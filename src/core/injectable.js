export class Injectable {
  static #services = new Map();

  static registerIn(classRef, from, args) {
    if (!this.#services.has(from)) {
      this.#services.set(from, new Map());
    }
    if (typeof classRef === "object") {
      args = classRef.args;
      classRef = classRef.service;
    }
    const mapFrom = this.#services.get(from);

    if (mapFrom) {
      const ref = mapFrom.get(classRef);

      if (!ref) {
        const value = new classRef(args);
        value.onRegister();
        mapFrom.set(classRef, value);
        value.notify({
          name: "inject-create",
          group: "injection",
          from
        });
      }
    }
  }

  static getFrom(classRef, from) {
    if (!this.#services.has(from)) {
      this.#services.set(from, new Map());
    }
    const mapFrom = this.#services.get(from);

    if (mapFrom) {
      const item = mapFrom.get(classRef);

      if (item) {
        item.onGet();
        return item;
      }
    }
  }

  static register(classRef, args) {
    this.registerIn(classRef, this, args);
  }

  static get(classRef) {
    return this.getFrom(classRef, this);
  }
}
