import {
  beaterOutputToMetric,
  makeCompletedBeatTicker,
} from '../../src/beater/subdivider.js';

describe('beaterOutputToMetric', () => {
  it('returns current values', () => {
    expect(
      beaterOutputToMetric({
        // Value doesn't matter.
        tempoBpm: 123,
        // Completed two measures + two quarter notes + one eighth note (half
        // beat) + one sixteenth note (quarter beat), halfway through next
        // sixteenth note.
        beatsElapsed: 4 + 4 + 2 + 0.875,
      }),
    ).toEqual({
      measure: 3,
      quarter: 3,
      eighth: 2,
      sixteenth: 2,
      partial: 0.5,
    });
  });
});

describe('makeCompletedBeatTicker', () => {
  it('emits beats when changed', () => {
    const tickerFunc = makeCompletedBeatTicker();

    // Measure starts deliberately at 0 so that the very first event will trigger a downbeat emission.
    expect(
      tickerFunc({ measure: 1, quarter: 1, eighth: 1, sixteenth: 1 }),
    ).toEqual({ measure: 1, quarter: 1, eighth: 1, sixteenth: 1 });

    // Same data should not trigger another output event.
    expect(
      tickerFunc({ measure: 1, quarter: 1, eighth: 1, sixteenth: 1 }),
    ).toBeNull();
  });
});
