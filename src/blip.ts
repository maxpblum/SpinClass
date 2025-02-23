// Utilities for creating a graph of nodes that process input streams (of
// "blips," which are data points of any type) into output streams. Akin to RxJS
// but more limited.

/** Object that can receive blips. */
export interface BlipReceiver<T> {
  /** Start processing blips from a given input stream. */
  readonly listen: (bs: BlipStream<T>) => void;
}

/** Source node that emits blips through custom logic. */
export class BlipStream<T> {
  private readonly handlers: ((v: T) => void)[] = [];

  /** Emit an output blip to any listeners. */
  protected emitValue(v: T) {
    for (const h of this.handlers) {
      h(v);
    }
  }

  /** Attach a listener to future output blips. */
  forEach(cb: (t: T) => void) {
    this.handlers.push(cb);
  }

  /** Send output blips to a specific receiver. */
  pipe(r: BlipReceiver<T>) {
    r.listen(this);
  }
}

/** Source node with a public method for emitting blips. */
export class TriggerableStream<T> extends BlipStream<T> {
  /** Emit a blip to all listeners. */
  trigger(v: T) {
    this.emitValue(v);
  }
}

/** BlipStream that emits a timestamp on each successive animation frame. */
export class AnimationFrameStream extends BlipStream<DOMHighResTimeStamp> {
  constructor() {
    super();
    const handleFrame = (ts: DOMHighResTimeStamp) => {
      this.emitValue(ts);
      window.requestAnimationFrame(handleFrame);
    };
    window.requestAnimationFrame(handleFrame);
  }
}

/** BlipReceiver class for side-effects-only logic. */
export class BlipSink<T> implements BlipReceiver<T> {
  constructor(private readonly handler: (blip: T) => void) {}

  /** @inheritdoc */
  listen(blips: BlipStream<T>) {
    blips.forEach(this.handler);
  }
}

/** Sink that collects blips into an exposed array, useful for testing. */
export class ArraySink<T> extends BlipSink<T> {
  /** Accumulated blips received so far. */
  readonly array: T[] = [];

  constructor() {
    super((v: T) => this.array.push(v));
  }
}

/** Blip node that both receives and emits blips with custom logic. */
export class Transform<InBlip, OutBlip>
  extends BlipStream<OutBlip>
  implements BlipReceiver<InBlip>
{
  constructor(private readonly transform: (inBlip: InBlip) => OutBlip | null) {
    super();
  }

  /** @inheritdoc */
  listen(bs: BlipStream<InBlip>) {
    bs.forEach((v) => {
      const transformOutput = this.transform(v);
      if (transformOutput != null) {
        this.emitValue(transformOutput);
      }
    });
  }
}

/** BlipStream emitting multiplexed blips from multiple input streams. */
export class Muxed<T> extends BlipStream<T> {
  constructor(private readonly bss: BlipStream<T>[]) {
    super();
    for (const bs of bss) {
      bs.forEach(this.emitValue.bind(this));
    }
  }
}

class StateMachine<State, InType, OutType> {
  private state: State;

  constructor(
    initial: State,
    private readonly reducer: (
      state: State,
      input: InType,
    ) => {
      newState: State;
      output?: OutType;
    },
  ) {
    this.state = initial;
  }

  iterateAndGetOutput(input: InType): OutType | null {
    const result = this.reducer(this.state, input);
    this.state = result.newState;
    return result.output ?? null;
  }
}

/**
 * Make function that processes input data into output data with internal state
 * transitions.
 */
export function makeStateMachine<State, InType, OutType>(
  initial: State,
  reducer: (
    state: State,
    input: InType,
  ) => { newState: State; output?: OutType },
): (input: InType) => OutType | null {
  const machine = new StateMachine<State, InType, OutType>(initial, reducer);
  return (input: InType) => machine.iterateAndGetOutput(input);
}
