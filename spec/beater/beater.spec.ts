import {
  BeaterState,
  beatsElapsed,
  makeTimeEvent,
} from '../../src/beater/beater.js';

describe('beatsElapsed', () => {
  describe('when time passes', () => {
    it('updates elapsed beats', () => {
      expect(
        beatsElapsed(
          {
            lastTimeMs: 1000 * 60 * 2,
            lastTempoChangeMs: 1000 * 60,
            beatsElapsedAtLastTempoChange: 10,
            tempoBpm: 20,
            beatsElapsed: -5,
          },
          makeTimeEvent(1000 * 60 * 3)
        ).output.beatsElapsed
      ).toEqual(10 + (20 * 2));
    });
  });
});
