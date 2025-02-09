export interface BlipReceiver<T> {
  readonly listen: (bs: BlipStream<T>) => void;
}

export class BlipStream<T> {
  private readonly handlers: ((v: T) => void)[] = [];
  protected emitValue(v: T) {
    for (const h of this.handlers) {
      h(v);
    }
  }
  forEach(cb: (t: T) => void) {
    this.handlers.push(cb);
  }
  pipe(r: BlipReceiver<T>) {
    r.listen(this);
  }
}

export class BlipStreamFromArray<T> extends BlipStream<T> {
  constructor(private readonly arr: T[]) {
    super();
    for (const v of arr) {
      this.emitValue(v);
    }
  }
}

export class TriggerableStream<T> extends BlipStream<T> {
  trigger(v: T) {
    this.emitValue(v);
  }
}
