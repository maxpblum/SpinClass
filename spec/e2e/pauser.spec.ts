import {
  makePauser,
  makeTimeEvent,
  PAUSE_EVENT,
  RESUME_EVENT,
  PauserEvent,
} from '../../src/pauser/pauser.js';
import { BlipTransformer } from '../../src/patcher/blip_transformer.js';
import { BlipSink } from '../../src/patcher/blip_sink.js';

async function* streamFromPromises<T>(promises: Promise<T>[]) {
  for (const p of promises) {
    yield await p;
  }
}

async function sinkBlipsToArray<T>(inBlips: AsyncIterable<T>) {
  const output: T[] = [];
  await new BlipSink((blip) => output.push(blip)).listen(inBlips);
  return output;
}

describe('test helpers', () => {
  it('streamFromPromises and sinkBlipsToArray work together', async () => {
    await expectAsync(
      sinkBlipsToArray(
        streamFromPromises([
          Promise.resolve(1),
          Promise.resolve(2),
          Promise.resolve(3),
        ])
      )
    ).toBeResolvedTo([1, 2, 3]);
  });
});

describe('pauser graph', () => {
  it('does not increment while paused', async () => {
    const inputStream = streamFromPromises<PauserEvent>([
      Promise.resolve(makeTimeEvent(10)),
      Promise.resolve(makeTimeEvent(12)),
      Promise.resolve(makeTimeEvent(15)),
    ]);
    const pauser = new BlipTransformer(inputStream, makePauser());
    await expectAsync(sinkBlipsToArray(pauser.outBlips())).toBeResolvedTo([
      { paused: true, elapsed: 0 },
      { paused: true, elapsed: 0 },
      { paused: true, elapsed: 0 },
    ]);
  });

  it('increments while resumed', async () => {
    const inputStream = streamFromPromises<PauserEvent>([
      Promise.resolve(makeTimeEvent(10)),
      Promise.resolve(RESUME_EVENT),
      Promise.resolve(makeTimeEvent(12)),
      Promise.resolve(makeTimeEvent(15)),
    ]);
    const pauser = new BlipTransformer(inputStream, makePauser());
    await expectAsync(sinkBlipsToArray(pauser.outBlips())).toBeResolvedTo([
      { paused: true, elapsed: 0 },
      { paused: false, elapsed: 0 },
      { paused: false, elapsed: 2 },
      { paused: false, elapsed: 5 },
    ]);
  });
});
