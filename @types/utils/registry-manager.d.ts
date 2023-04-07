export declare type RegistryManagerReturn = {
  id: number
  unregister: () => void
};

export declare class RegistryManager<T> {
  registry(data: T): RegistryManagerReturn;
  unregister(id: number): void
  get(id: number): T | undefined;
  getAll(): T[];
}
