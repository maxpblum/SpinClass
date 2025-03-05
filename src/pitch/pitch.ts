const [A, Bf, B, C, Df, D, Ef, E, F, Fs, G, Af] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
].map((n) => 440 * 2 ** (n / 12));

const DEFAULT_ARPEGGIO_RANGE_MIN = A / (2 * 2 * 2);
const DEFAULT_ARPEGGIO_RANGE_MAX = A * 2;

/**
 * Get a list of all octave-shifted pitches for a given pitch within a given
 * pitch range.
 */
export function atAllOctavesInRange(
  pitch: number,
  min: number,
  max: number,
): Set<number> {
  let candidate: number = pitch;

  // If there is an octave of the given pitch in the given range, get to the
  // minimum one. If not, return empty array.
  if (candidate < min) {
    while (candidate < min) {
      candidate *= 2;
    }
    if (candidate > max) {
      return new Set();
    }
  } else if (candidate > max) {
    while (candidate > max) {
      candidate /= 2;
    }
    if (candidate < min) {
      return new Set();
    }
    while (candidate >= min * 2) {
      candidate /= 2;
    }
  }

  const atAllOctaves: Set<number> = new Set();
  while (candidate <= max) {
    atAllOctaves.add(candidate);
    candidate *= 2;
  }

  return atAllOctaves;
}

/**
 * Get all octave-shifted pitches for some cluster of pitches mapped all over
 * a given range.
 */
export function mapClusterToRange(
  pitches: Iterable<number>,
  min: number,
  max: number,
): Set<number> {
  const output: Set<number> = new Set();
  for (const p of pitches) {
    for (const shiftedPitch of atAllOctavesInRange(p, min, max)) {
      output.add(shiftedPitch);
    }
  }
  return output;
}

const FIFTH = 2 ** (7 / 12);
const MAJ_THIRD = 2 ** (4 / 12);
const MIN_THIRD = 2 ** (3 / 12);

/** Build a basic major triad. */
export function major(pitch: number): Set<number> {
  return new Set([pitch, pitch * FIFTH, pitch * MAJ_THIRD]);
}

/** Build a basic minor triad. */
export function minor(pitch: number): Set<number> {
  return new Set([pitch, pitch * FIFTH, pitch * MIN_THIRD]);
}
