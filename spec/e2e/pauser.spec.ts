import { PauserOutput } from '../../src/interfaces.js';
import {
  makePauser,
  makeTimeEvent,
  RESUME_EVENT,
  PauserEvent,
} from '../../src/pauser/pauser.js';
import { Transform, ArraySink, TriggerableStream } from '../../src/blip.js';

describe('pauser graph', () => {
  it('does not increment while paused', () => {
    const inputStream = new TriggerableStream();

    const timeTransformer = new Transform(makeTimeEvent);
    inputStream.pipe(timeTransformer);

    const pauser = new Transform(makePauser());
    timeTransformer.pipe(pauser);

    const sink = new ArraySink<PauserOutput>();
    pauser.pipe(sink);

    inputStream.trigger(10);
    inputStream.trigger(12);
    inputStream.trigger(15);

    expect(sink.array).toEqual([
      { paused: true, elapsed: 0 },
      { paused: true, elapsed: 0 },
      { paused: true, elapsed: 0 },
    ]);
  });

  it('increments while resumed', () => {
    const inputStream = new TriggerableStream<PauserEvent>();

    const pauser = new Transform(makePauser());
    inputStream.pipe(pauser);

    const sink = new ArraySink<PauserOutput>();
    pauser.pipe(sink);

    [
      makeTimeEvent(10),
      RESUME_EVENT,
      makeTimeEvent(12),
      makeTimeEvent(15),
    ].forEach((e) => inputStream.trigger(e));

    expect(sink.array).toEqual([
      { paused: true, elapsed: 0 },
      { paused: false, elapsed: 0 },
      { paused: false, elapsed: 2 },
      { paused: false, elapsed: 5 },
    ]);
  });
});
