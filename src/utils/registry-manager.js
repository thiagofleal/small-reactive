export class RegistryManager {
  #nextId = 1;
  #registries = {};

  registry(data) {
    const index = this.#nextId++;

    this.#registries[index] = data;

    return {
      id: index,
      unregister: () => this.unregister(index)
    }
  }

  unregister(id) {
    delete this.#registries[id]
  }

  get(id) {
    return this.#registries[id];
  }

  getAll() {
    return Object.keys(this.#registries).map(key => this.#registries[key]);
  }
}
