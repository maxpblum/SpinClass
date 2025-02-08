import { BlipStream, BlipReceiver } from './blip_stream.js';

export class BlipSink<T> implements BlipReceiver<T> {
  constructor(private readonly handler: (blip: T) => void) {}
  listen(blips: BlipStream<T>) {
    blips.forEach(this.handler);
  }
}

export class ArraySink<T> extends BlipSink<T> {
  readonly array: T[] = [];
  constructor() {
    super((v: T) => this.array.push(v));
  }
}
