import { Observable } from "./observable.js";

class BaseSubject extends Observable {
	#observers = {};
	#nextIndex = 0;

	#forEach(callback) {
		for (const key in this.#observers) {
			callback(this.#observers[key]);
		}
	}

	constructor(callback) {
		super(observer => {
			const index = this.#nextIndex++;
			this.#observers[index] = observer;
			if (callback) callback();
			return () => {
				delete this.#observers[index];
			};
		});
	}

	next(value) {
		this.#forEach(observer => observer.next(value));
	}

	error(err) {
		this.#forEach(observer => observer.error(err));
	}

	complete() {
		this.#forEach(observer => observer.complete());
	}
}

export class Subject extends BaseSubject {
	constructor() {
		super();
	}
}

export class BehaviorSubject extends BaseSubject {
	#current = null;

	constructor(initial) {
		super(() => this.next(this.#current));
		this.#current = initial;
	}

	next(value) {
		this.#current = value;
		return super.next(value);
	}
}

export class ReplaySubject extends BaseSubject {
	#current = [];
	#length = 0;
	#ignore = false;

	constructor(length) {
		super(() => {
			this.#ignore = true;
			this.#current.forEach(e => this.next(e));
			this.#ignore = false;
		});
		this.#length = length;
	}

	next(value) {
		if (!this.#ignore) {
			while (this.#current.length >= this.#length) {
				this.#current.shift();
			}
			this.#current.push(value);
		}
		return super.next(value);
	}
}

export class AsyncSubject extends BaseSubject {
	#value = null;
	#completed = false;

	constructor() {
		super(() => {
			if (this.#completed) {
				this.#emitValue();
			}
		})
	}

	#emitValue() {
		super.next(this.#value);
	}

	next(value) {
		this.#value = value;
	}

	complete() {
		this.#completed = true;
		this.#emitValue();
		return super.complete();
	}
}
