import { Observer } from "./observer"

interface UnaryFunction<T, R> {
  (source: T): R
}

export class Observable<T> {
	constructor(func: (subject: Observer<T>) => void | Promise<void>);

	subscribe(observer: ((value?: T) => void | Promise<void>) | (() => void | Promise<void>) | {
    next?: ((value: T) => void | Promise<void>) | (() => void | Promise<void>)
    error?: (value: any) => void | Promise<void>
    complete?: () => void | Promise<void>
  }): void;

	toPromise(): Promise<T>;

  pipe(): Observable<T>;
  pipe<R>(transform: UnaryFunction<T, R>): R;
  pipe<R, S>(
    transform0: UnaryFunction<T, R>,
    transform1: UnaryFunction<R, S>
  ): S;
  pipe<R, S, T>(
    transform0: UnaryFunction<T, R>,
    transform1: UnaryFunction<R, S>,
    transform2: UnaryFunction<S, T>
  ): T;
  pipe<R, S, T, U>(
    transform0: UnaryFunction<T, R>,
    transform1: UnaryFunction<R, S>,
    transform2: UnaryFunction<S, T>,
    transform3: UnaryFunction<T, U>
  ): U;
  pipe<R, S, T, U, V>(
    transform0: UnaryFunction<T, R>,
    transform1: UnaryFunction<R, S>,
    transform2: UnaryFunction<S, T>,
    transform3: UnaryFunction<T, U>,
    transform4: UnaryFunction<U, V>
  ): V;
  pipe(...pipeline: UnaryFunction<any, any>[]): any;
}
