import {BlipStream} from './blip_stream.js';

export class AnimationFrameStream extends BlipStream<DOMHighResTimeStamp> {
  forEach(cb: (ts: DOMHighResTimeStamp) => void) {
    function handleFrame(ts: DOMHighResTimeStamp) {
      cb(ts);
      window.requestAnimationFrame(handleFrame);
    }
    window.requestAnimationFrame(handleFrame);
  }
}
