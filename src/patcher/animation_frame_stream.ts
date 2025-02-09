import { BlipStream } from './blip_stream.js';

export class AnimationFrameStream extends BlipStream<DOMHighResTimeStamp> {
  constructor() {
    super();
    function handleFrame(ts: DOMHighResTimeStamp) {
      this.emitValue(ts);
      window.requestAnimationFrame(handleFrame);
    }
    window.requestAnimationFrame(handleFrame);
  }
}
