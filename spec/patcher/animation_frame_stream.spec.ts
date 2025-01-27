import { AnimationFrameStream } from "../../src/patcher/animation_frame_stream.js";

describe("AnimationFrameStream", () => {
  it("yields values from requestAnimationFrame", async () => {
    // Create a fake window.requestAnimationFrame that calls the callback
    // function with incremental integers starting at 1, using
    // setTimeout(..., 0) to yield the thread in between increments, just like
    // the real function would yield the thread in between loop iterations.
    let nextValueToEmit: DOMHighResTimeStamp = 1;
    const fakeRequestAnimationFrame = (
      cb: (ts: DOMHighResTimeStamp) => void
    ) => {
      setTimeout(() => {
        cb(nextValueToEmit);
        nextValueToEmit++;
      }, 0);
    };

    // Now run the code under test and make sure the first three values are
    // what we expect.
    const stream = new AnimationFrameStream(fakeRequestAnimationFrame);
    const receivedValues: DOMHighResTimeStamp[] = [];
    for await (const v of stream) {
      receivedValues.push(v);
      if (receivedValues.length === 3) {
        break;
      }
    }
    expect(receivedValues).toEqual([1, 2, 3]);
  });
});
