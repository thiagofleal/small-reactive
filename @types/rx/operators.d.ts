import { Observable } from "./observable";

interface UnaryFunction<T, R> {
  (source: T): R
}

export function map<T, R>(transform: UnaryFunction<T, R>): Observable<R>
export function filter<T, R>(condition: UnaryFunction<T, R>): Observable<R>;
export function first<T>(): Observable<T>;
export function of<T>(...src: T[]): Observable<T>;
export function from<T>(src: T[] | Promise<T>): Observable<T>;
export function interval(interv: number): Observable<number>;
export function fromEvents<T = any>(emitter: EventTarget, events: string[]): Observable<T>;
export function fromEvent<T = any>(emitter: EventTarget, eventName: string): Observable<T>;
export function fromEventSource<T = any>(url: string, events: string[]): Observable<T>;
