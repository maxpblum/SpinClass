import { beaterOutputToMetric } from '../../src/beater/subdivider.js';

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
