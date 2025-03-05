import {
  atAllOctavesInRange,
  mapClusterToRange,
} from '../../src/pitch/pitch.js';

describe('atAllOctavesInRange', () => {
  it('returns expected pitches', () => {
    expect(atAllOctavesInRange(110, 200, 900)).toEqual(
      new Set([220, 440, 880])
    );
  });
});

describe('mapClusterToRange', () => {
  it('returns expected pitches', () => {
    expect(mapClusterToRange(new Set([110, 880, 150]), 200, 900)).toEqual(
      new Set([220, 300, 440, 600, 880])
    );
  });
});
