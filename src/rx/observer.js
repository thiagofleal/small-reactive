export class Observer {
	#subscribed = true;
	#unsubscribe = () => {};

	constructor(next, error, complete) {
		this.onNext = next ? next : () => { };
		this.onError = error ? error : () => { };
		this.onComplete = complete ? complete : () => { };
		this.setUnsubscribe();
	}

	setUnsubscribe(unsubscribe) {
		if (unsubscribe && typeof unsubscribe === "function") this.#unsubscribe = unsubscribe;
	}

	next(value) {
		if (this.#subscribed) {
			this.onNext(value);
		}
	}

	error(err) {
		if (this.#subscribed) {
			try {
				this.onError(err);
			} finally {
				this.unsubscribe();
			}
		}
	}

	complete() {
		if (this.#subscribed) {
			try {
				this.onComplete();
			} finally {
				this.unsubscribe();
			}
		}
	}

	unsubscribe() {
		this.#subscribed = false;
		this.#unsubscribe();
	}
}
