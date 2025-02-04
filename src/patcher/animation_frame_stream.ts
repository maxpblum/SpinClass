export class AnimationFrameStream
  implements AsyncIterable<DOMHighResTimeStamp>
{
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
              done: false,
              value: timestamp,
            });
          };
        });
      },
    };
  }
}
