import {BlipStream} from './blip_stream.js';

export class TriggerableStream<T> extends BlipStream<T> {
  private readonly handlers: ((v: T) => void)[] = [];

  forEach(cb: (v: T) => void) {
    this.handlers.push(cb);
  }

  trigger(v: T) {
    this.handlers.forEach((h) => h(v));
  }
}
