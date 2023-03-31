export class Injectable {
  static services = [];

  static register(classRef, ...args) {
    const ref = this.services.find(i => i.classRef === classRef);

    if (!ref) {
      const value = new classRef(...args);
      value.onRegister();
      this.services.push({ classRef, value });
      value.notify({
        name: "inject-create",
        group: "injection",
        from: this
      });
    }
  }

  static get(classRef) {
    const item = this.services.find(i => i.classRef === classRef);

    if (item) {
      item.value.onGet();
      return item.value;
    }
    return null;
  }
}
