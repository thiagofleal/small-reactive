import { Observable } from "./observable.js";

export class Subject extends Observable {
	#observers = {};
	#nextIndex = 0;

	#forEach(callback) {
		for (const key in this.#observers) {
			callback(this.#observers[key]);
		}
	}

	constructor() {
		super(observer => {
			const index = this.#nextIndex++;
			this.#observers[index] = observer;
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
