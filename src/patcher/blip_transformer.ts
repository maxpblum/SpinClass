import {BlipReceiver, BlipStream} from './blip_stream.js';

export class Transform<InBlip, OutBlip> extends BlipStream<OutBlip> implements BlipReceiver<InBlip> {
  private handlers: ((h: OutBlip) => void)[] = [];

  constructor(private readonly transform: (inBlip: InBlip) => OutBlip) {
    super();
  }

  forEach(cb: (v: OutBlip) => void) {
    this.handlers.push(cb);
  }

  listen(bs: BlipStream<InBlip>) {
    bs.forEach((v) => {
      const newVal = this.transform(v);
      this.handlers.forEach((h) => h(newVal));
    });
  }
}
