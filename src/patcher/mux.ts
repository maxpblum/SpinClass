import { BlipStream } from './blip_stream.js';

export class Muxed<T> extends BlipStream<T> {
  constructor(private readonly bss: BlipStream<T>[]) {
    super();
    for (const bs of bss) {
      bs.forEach(this.emitValue.bind(this));
    }
  }
}
