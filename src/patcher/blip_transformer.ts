import { BlipReceiver, BlipStream } from './blip_stream.js';

export class Transform<InBlip, OutBlip>
  extends BlipStream<OutBlip>
  implements BlipReceiver<InBlip>
{
  constructor(private readonly transform: (inBlip: InBlip) => OutBlip) {
    super();
  }

  listen(bs: BlipStream<InBlip>) {
    bs.forEach((v) => {
      this.emitValue(this.transform(v));
    });
  }
}
