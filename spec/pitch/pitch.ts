import {
  atAllOctavesInRange,
  mapClusterToRange,
} from '../../src/pitch/pitch.js';

describe('atAllOctavesInRange', () => {
  it('returns expected pitches', () => {
    expect(
      atAllOctavesInRange({ name: 'something', canonicalFreq: 110 }, 200, 900),
    ).toEqual(new Set([220, 440, 880]));
  });
});

describe('mapClusterToRange', () => {
  it('returns expected pitches', () => {
    expect(
      mapClusterToRange(
        new Set([
          { name: 't', canonicalFreq: 110 },
          { name: 'u', canonicalFreq: 880 },
          { name: 'v', canonicalFreq: 150 },
        ]),
        200,
        900,
      ),
    ).toEqual(new Set([220, 300, 440, 600, 880]));
  });
});
