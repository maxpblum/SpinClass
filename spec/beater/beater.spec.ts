import { makeTimeEvent, makeTempoEvent } from '../../src/interfaces.js';
import { beatsElapsed, makeBeater } from '../../src/beater/beater.js';

describe('beatsElapsed', () => {
  it('emits expected data for new time', () => {
    expect(
      beatsElapsed(
        {
          lastTimeMs: 1000 * 60 * 2,
          lastTempoChangeMs: 1000 * 60,
          beatsElapsedAtLastTempoChange: 10,
          tempoBpm: 20,
          beatsElapsed: -5,
        },
        makeTimeEvent(1000 * 60 * 3),
      ),
    ).toEqual({
      newState: {
        lastTimeMs: 1000 * 60 * 3,
        lastTempoChangeMs: 1000 * 60,
        beatsElapsedAtLastTempoChange: 10,
        tempoBpm: 20,
        beatsElapsed: 10 + 20 * 2,
      },
      output: {
        tempoBpm: 20,
        beatsElapsed: 10 + 20 * 2,
      },
    });
  });

  it('emits expected data for new tempo', () => {
    expect(
      beatsElapsed(
        {
          lastTimeMs: 1000 * 60 * 2,
          lastTempoChangeMs: 1000 * 60,
          beatsElapsedAtLastTempoChange: 10,
          tempoBpm: 20,
          beatsElapsed: 5,
        },
        makeTempoEvent(30),
      ),
    ).toEqual({
      newState: {
        lastTimeMs: 1000 * 60 * 2,
        lastTempoChangeMs: 1000 * 60 * 2,
        beatsElapsedAtLastTempoChange: 5,
        tempoBpm: 30,
        beatsElapsed: 5,
      },
      output: {
        tempoBpm: 30,
        beatsElapsed: 5,
      },
    });
  });
});

describe('makeBeater', () => {
  it('works', () => {
    // Just a basic test that the wiring is correct. We trust that makeStateMachine and beatsElapsed both do their job as tested elsewhere.
    const beaterFunc = makeBeater();
    expect(beaterFunc(makeTimeEvent(3))!.beatsElapsed).toBeGreaterThan(0);
  });
});
