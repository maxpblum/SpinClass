import {
  makePauser,
  makeTimeEvent,
  PAUSE_EVENT,
  RESUME_EVENT,
} from '../../src/pauser/pauser.js';
import { AnimationFrameStream } from '../../src/patcher/animation_frame_stream.js';
import { BlipTransformer } from '../../src/patcher/blip_transformer.js';
import { BlipSink } from '../../src/patcher/blip_sink.js';

function makeFakeRequestAnimationFrame() {
  let nextCb: ((ts: DOMHighResTimeStamp) => void) | null = null;
  return {
    trigger: (ts: DOMHighResTimeStamp) => {
      nextCb?.(ts);
    },
    requestAnimationFrame: (cb: (ts: DOMHighResTimeStamp) => void) => {
      nextCb = cb;
    },
  };
}

function makeArrayBlipSink<T>() {
  const results: T[] = [];
  const sink = new BlipSink<T>((blip) => {
    results.push(blip);
  });
  return { sink, results };
}

function makeGraph() {
  const fakeReqAf = makeFakeRequestAnimationFrame();
  const afStream = new AnimationFrameStream(fakeReqAf.requestAnimationFrame);
  const afEventNode = new BlipTransformer(afStream, makeTimeEvent);
  const { sink, results } = makeArrayBlipSink();
  const waitForResultsPromise = sink.listen(afEventNode.outBlips());
  async function waitForResults() {
    await waitForResultsPromise;
    return results;
  }
  return {
    triggerAf: (ts: DOMHighResTimeStamp, shouldEnd: boolean = false) => {
      afStream.shouldEnd = shouldEnd;
      fakeReqAf.trigger(ts);
    },
    waitForResults,
    endStream: () => {
      afStream.shouldEnd = true;
    },
  };
}

describe('graph', () => {
  it('hangs forever?', async () => {
    // TODO: Why is this hanging forever? Probably I'm using synchronous code somewhere to simulate asynchronous things.
    const { triggerAf, waitForResults, endStream } = makeGraph();
    // triggerAf(100);  // Should initialize state
    // triggerAf(200);  // Should increment elapsed to 100
    triggerAf(250, true); // Should increment elapsed to 150 and end the stream.
    await new Promise((res) => {
      setTimeout(res, 100);
    });
    await expectAsync(waitForResults()).toBeResolvedTo([100, 150]);
  });
});
