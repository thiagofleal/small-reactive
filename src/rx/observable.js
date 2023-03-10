import { Subscription } from "./subscription.js";
import { Observer } from "./observer.js";

export class Observable {
	#func = () => {};

	constructor(func) {
		this.#func = func;
	}

	subscribe(observer) {
		let next, error, complete;
		next = error = complete = () => { };
		if (typeof observer === "object") {
			if (observer.next) {
				next = observer.next;
			}
			if (observer.error) {
				error = observer.error;
			}
			if (observer.complete) {
				complete = observer.complete;
			}
		}
		if (typeof observer === "function") {
			next = observer;
		}
		const observe = new Observer(next, error, complete);
		const subscription = new Subscription();

		const ret = this.#func(observe);
		subscription.add(observe);

		if (typeof ret === "function") {
			observe.setUnsubscribe(ret);
		}
		return subscription;
	}

	toPromise() {
		return new Promise((resolve, failure) => {
			let resolveValue = undefined;
			this.subscribe({
				next: value => {
					resolveValue = value;
				},
				error: err => failure(err),
				complete: () => {
					resolve(resolveValue);
				}
			});
		});
	}

	pipe(...pipeline) {
    let resultObservable = this;
    for (const operator of pipeline) {
      resultObservable = operator(resultObservable);
    }
    return resultObservable;
  }
}
