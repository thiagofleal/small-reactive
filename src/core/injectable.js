export class Injectable {
  static #services = {};

  static registerIn(classRef, from, args) {
    if (!this.#services[from]) {
      this.#services[from] = [];
    }
    if (typeof classRef === "object") {
      args = classRef.args;
      classRef = classRef.service;
    }
    const ref = this.#services[from].find(i => i.classRef === classRef);

    if (!ref) {
      const value = new classRef(args);
      value.onRegister();
      this.#services[from].push({ classRef, value });
      value.notify({
        name: "inject-create",
        group: "injection",
        from
      });
    }
  }

  static getFrom(classRef, from) {
    if (!this.#services[from]) {
      this.#services[from] = [];
    }
    const item = this.#services[from].find(i => i.classRef === classRef);

    if (item) {
      item.value.onGet();
      return item.value;
    }
  }

  static register(classRef, args) {
    this.registerIn(classRef, this, args);
  }

  static get(classRef) {
    return this.getFrom(classRef, this);
  }
}
