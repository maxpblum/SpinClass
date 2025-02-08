import { BlipStream } from './blip_stream.js';

export class Muxed<T> extends BlipStream<T> {
  private readonly handlers: ((v: T) => void)[] = [];

  constructor(private readonly bss: BlipStream<T>[]) {
    super();
    for (const bs of bss) {
      bs.forEach(this.emitValue.bind(this));
    }
  }

  private emitValue(v: T) {
    for (const h of this.handlers) {
      h(v);
    }
  }

  forEach(handler: (v: T) => void) {
    this.handlers.push(handler);
  }
}
