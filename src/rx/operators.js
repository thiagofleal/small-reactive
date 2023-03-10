import { Observable } from "./observable.js";

export function map(transform) {
  return subscriber => {
    return new Observable(observer => {
      const subscription = subscriber.subscribe({
        next: value => observer.next(transform(value)),
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
      return () => subscription.unsubscribe();
    });
  };
}

export function filter(condition) {
  return subscriber => {
    return new Observable(observer => {
      const subscription = subscriber.subscribe({
        next: value => {
          if (condition(value)) {
            observer.next(value);
          }
        },
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
      return () => subscription.unsubscribe();
    });
  };
}

export function first() {
  return subscriber => {
    return new Observable(observer => {
      const subscription = subscriber.subscribe({
        next: value => {
          observer.next(value);
          observer.complete();
        },
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
      return () => subscription.unsubscribe();
    });
  };
}

export function of(...src) {
  return new Observable(observer => {
    src.forEach(e => {
      observer.next(e);
    });
    observer.complete();
  });
}

export function from(src) {
  return new Observable(observer => {
    if (Array.isArray(src)) {
      for (let key in src) {
        observer.next(src[key]);
      }
      observer.complete();
    }
    if (src instanceof Promise) {
      src.then(value => {
        observer.next(value);
        observer.complete();
      }).catch(err => observer.error(err));
    }
  });
}

export function interval(interv) {
  return new Observable(observer => {
    let i = 0;

    const id = setInterval(() => {
      observer.next(i++);
    }, interv);

    return () => clearInterval(id);
  });
}

export function fromEvents(emitter, events) {
  if (!Array.isArray(events)) {
    events = [events];
  }
  return new Observable(observer => {
    const handler = event => observer.next(event);

    events.forEach(eventName => {
      emitter.addEventListener(eventName, handler);
    });
    return () => {
      events.forEach(eventName => {
        emitter.removeEventListener(eventName, handler)
      });
    };
  });
}

export function fromEvent(emitter, eventName) {
  return fromEvents(emitter, [eventName]);
}

export function fromEventSource(url, events) {
  const source = new EventSource(url);

  if (!Array.isArray(events)) {
    events = [events];
  }
  return new Observable(observer => {
    try {
      events.forEach(event => {
        source.addEventListener(event, evt => observer.next(evt));
      });
      source.onerror = err => {
        observer.error(err);
      };
    } catch (err) {
      observer.error(err);
    }
    return () => source.close();
  });
}
