import { BeaterOutput } from './beater.js';

/** A rhythmic "point in time" in terms of measures and beats. */
export interface CompletedMetricBeat {
  /** Measure number, as a one-indexed integer. */
  measure: number;

  /** Quarter-note beat within the measure. */
  quarter: 1 | 2 | 3 | 4;

  /** Eighth-note beat within the quarter note. */
  eighth: 1 | 2;

  /** Sixteenth-note beat within the eighth note. */
  sixteenth: 1 | 2;
}

/** MetricBeat with partial remainder. */
export interface MetricBeat extends CompletedMetricBeat {
  /** Completed fraction of the sixteenth note. */
  partial: number;
}

/** Transforms BeaterOutput into MetricBeat. Assumes time signature is always 4/4. */
export function beaterOutputToMetric(bo: BeaterOutput): MetricBeat {
  // Which one-indexed measure is currently happening.
  const measure = 1 + Math.floor(bo.beatsElapsed / 4);

  // How many beats have been completed in the measure, which is different from
  // "which one-indexed beat is currently happening."
  const beatsIntoMeasure = bo.beatsElapsed % 4;

  // Which one-indexed quarter note is currently happening within the current measure.
  const quarter = (1 + Math.floor(beatsIntoMeasure)) as 1 | 2 | 3 | 4;

  // What fraction of the current quarter-note beat has elapsed.
  const partialQuarter = beatsIntoMeasure % 1;

  // Which one-indexed eighth note is currently happening within the current quarter note.
  const eighth = partialQuarter < 0.5 ? 1 : 2;

  // Which one-indexed sixteenth note is currently happening within the current eighth note.
  const sixteenth = partialQuarter % 0.5 < 0.25 ? 1 : 2;

  // What fraction of the current sixteenth-note beat has elapsed.
  const partial = 4 * (partialQuarter % 0.25);

  return { measure, quarter, eighth, sixteenth, partial };
}
