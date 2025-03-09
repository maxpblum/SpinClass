/** Interface for named pitch classes. */
export interface PitchClass {
  name: string;
  canonicalFreq: number;
}

const A: PitchClass = { name: 'A', canonicalFreq: 440 * 2 ** (0 / 12) };
const Bf: PitchClass = { name: 'Bf', canonicalFreq: 440 * 2 ** (1 / 12) };
const B: PitchClass = { name: 'B', canonicalFreq: 440 * 2 ** (2 / 12) };
const C: PitchClass = { name: 'C', canonicalFreq: 440 * 2 ** (3 / 12) };
const Df: PitchClass = { name: 'Df', canonicalFreq: 440 * 2 ** (4 / 12) };
const D: PitchClass = { name: 'D', canonicalFreq: 440 * 2 ** (5 / 12) };
const Ef: PitchClass = { name: 'Ef', canonicalFreq: 440 * 2 ** (6 / 12) };
const E: PitchClass = { name: 'E', canonicalFreq: 440 * 2 ** (7 / 12) };
const F: PitchClass = { name: 'F', canonicalFreq: 440 * 2 ** (8 / 12) };
const Fs: PitchClass = { name: 'Fs', canonicalFreq: 440 * 2 ** (9 / 12) };
const G: PitchClass = { name: 'G', canonicalFreq: 440 * 2 ** (10 / 12) };
const Af: PitchClass = { name: 'Af', canonicalFreq: 440 * 2 ** (11 / 12) };

/** PitchClass objects for all twelve canonical tones. */
export const TWELVE_TONES = [A, Bf, B, C, Df, D, Ef, E, F, Fs, G, Af];

function upSemis(root: PitchClass, semis: number): PitchClass {
  return TWELVE_TONES[(TWELVE_TONES.indexOf(root) + semis) % 12];
}

/** Type for a major or minor triad. */
export interface Triad {
  root: PitchClass;
  third: PitchClass;
  fifth: PitchClass;
  variant: 'major' | 'minor';
}

/** Get canonical triad name. */
export function triadName(t: Triad) {
  return `${t.root.name} ${t.variant}`;
}

/** Build a basic major triad. */
export function major(pitch: PitchClass): Triad {
  return {
    root: pitch,
    third: upSemis(pitch, 4),
    fifth: upSemis(pitch, 7),
    variant: 'major',
  };
}

/** Build a basic minor triad. */
export function minor(pitch: PitchClass): Triad {
  return {
    root: pitch,
    third: upSemis(pitch, 3),
    fifth: upSemis(pitch, 7),
    variant: 'minor',
  };
}

/** Reasonable min arpeggiation pitch. */
export const DEFAULT_ARPEGGIO_RANGE_MIN = 440 / (2 * 2 * 2);
/** Reasonable max arpeggiation pitch. */
export const DEFAULT_ARPEGGIO_RANGE_MAX = 440 * 2;

/**
 * Get a list of all octave-shifted pitches for a given pitch within a given
 * pitch range.
 */
export function atAllOctavesInRange(
  pitch: PitchClass,
  min: number,
  max: number,
): Set<number> {
  const atAllOctaves: Set<number> = new Set();

  // Add all octaves going downward.
  let downwardCandidate: number = pitch.canonicalFreq;
  while (downwardCandidate >= min) {
    if (downwardCandidate < max) {
      atAllOctaves.add(downwardCandidate);
    }
    downwardCandidate /= 2;
  }

  // Add all octaves going upward.
  let upwardCandidate: number = pitch.canonicalFreq;
  while (upwardCandidate <= max) {
    if (upwardCandidate > min) {
      atAllOctaves.add(upwardCandidate);
    }
    upwardCandidate *= 2;
  }

  return atAllOctaves;
}

/**
 * Get all octave-shifted pitches for some cluster of pitches mapped all over
 * a given range.
 */
export function mapClusterToRange(
  pitches: Iterable<PitchClass>,
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

/**
 * Get all octave-shifted pitches for some major or minor triad mapped all over
 * a given range.
 */
export function mapTriadToRange(
  triad: Triad,
  min: number,
  max: number,
): Set<number> {
  return mapClusterToRange([triad.root, triad.third, triad.fifth], min, max);
}
