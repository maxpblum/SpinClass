export class AnimationFrameStream
  implements AsyncIterable<DOMHighResTimeStamp>
{
  /** Whether to end the stream permanently. Only foreseen use is testing. */
  public shouldEnd: boolean = false;

  constructor(
    private readonly requestAnimationFrame: (
      cb: (ts: DOMHighResTimeStamp) => void,
    ) => void,
  ) {}

  [Symbol.asyncIterator]() {
    let nextResolveFunc;
    const thisAnimationFrameStream = this;

    function iterate() {
      thisAnimationFrameStream.requestAnimationFrame((timestamp) => {
        if (nextResolveFunc) {
          nextResolveFunc(timestamp);
        }
        iterate();
      });
    }
    iterate();

    return {
      next(): Promise<IteratorResult<DOMHighResTimeStamp>> {
        return new Promise<IteratorResult<DOMHighResTimeStamp>>((resolve) => {
          nextResolveFunc = (timestamp: DOMHighResTimeStamp) => {
            resolve({
              done: this.shouldEnd,
              value: timestamp,
            });
          };
        });
      },
    };
  }
}
