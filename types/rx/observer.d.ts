export class Observer<T> {
	constructor(
    next: (value: T) => void | Promise<void>,
    error: (value: any) => void | Promise<void>,
    complete: () => void | Promise<void>
  );

	setUnsubscribe(unsubscribe: () => void | Promise<void>): void;

	next(value: T): void;
	error(err: any): void;
	complete(): void;

	unsubscribe(): void;
}
