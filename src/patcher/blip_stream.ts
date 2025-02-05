export interface BlipReceiver<T> {
  readonly listen: (bs: BlipStream<T>) => void;
}

export class BlipStream<T> {
  forEach(cb: (t: T) => void) {
    throw new Error('not implemented');
  }
  pipe(r: BlipReceiver<T>) {
    r.listen(this);
  }
}

export class BlipStreamFromArray<T> extends BlipStream<T> {
  constructor(private readonly arr: T[]) {
    super();
  }
  forEach(cb: (t: T) => void) {
    this.arr.forEach(cb);
  }
}

export class TriggerableStream<T> extends BlipStream<T> {
  private readonly handlers: ((v: T) => void)[] = [];

  forEach(cb: (v: T) => void) {
    this.handlers.push(cb);
  }

  trigger(v: T) {
    this.handlers.forEach((h) => h(v));
  }
}
