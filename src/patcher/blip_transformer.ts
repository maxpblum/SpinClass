import { BlipReceiver, BlipStream } from './blip_stream.js';

export class Transform<InBlip, OutBlip>
  extends BlipStream<OutBlip>
  implements BlipReceiver<InBlip>
{
  constructor(private readonly transform: (inBlip: InBlip) => OutBlip | null) {
    super();
  }

  listen(bs: BlipStream<InBlip>) {
    bs.forEach((v) => {
      const transformOutput = this.transform(v);
      if (transformOutput != null) {
        this.emitValue(transformOutput);
      }
    });
  }
}
