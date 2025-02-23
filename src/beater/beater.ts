import { makeStateMachine } from '../blip.js';
import { NewTime, NewTempo, DEFAULT_TEMPO_BPM } from '../interfaces.js';

/** Internal Beater state. */
export interface BeaterState {
  /** Last total time elapsed in milliseconds. */
  lastTimeMs: DOMHighResTimeStamp;
  /** What the total time elapsed was when the tempo last changed. */
  lastTempoChangeMs: DOMHighResTimeStamp;
  /** How many total beats had elapsed as of the last tempo change. */
  beatsElapsedAtLastTempoChange: number;
  /** Current tempo in beats per minute. */
  tempoBpm: number;
  /** How many total beats have elapsed since the start. */
  beatsElapsed: number;
}

/** Valid input for a Beater. */
export type BeaterEvent = NewTime | NewTempo;

/** Beat event. */
export interface BeaterOutput {
  /** Current tempo in beats per minute. */
  tempoBpm: number;
  /** How many total beats have elapsed since the start. */
  beatsElapsed: number;
}

/**
 * Get next beat event and next internal beater state given input event and
 * previous state.
 */
export function beatsElapsed(state: BeaterState, be: BeaterEvent) {
  if (be.kind === 'newtime') {
    const msSinceLastTempoChange = be.newTimeMs - state.lastTempoChangeMs;
    const minSinceLastTempoChange = msSinceLastTempoChange / (1000 * 60);
    const beatsSinceLastTempoChange = state.tempoBpm * minSinceLastTempoChange;
    const newBeatsElapsed =
      state.beatsElapsedAtLastTempoChange + beatsSinceLastTempoChange;
    return {
      newState: {
        ...state,
        lastTimeMs: be.newTimeMs,
        beatsElapsed: newBeatsElapsed,
      },
      output: {
        tempoBpm: state.tempoBpm,
        beatsElapsed: newBeatsElapsed,
      },
    };
  } else {
    // New tempo.
    return {
      newState: {
        lastTimeMs: state.lastTimeMs,
        beatsElapsed: state.beatsElapsed,
        beatsElapsedAtLastTempoChange: state.beatsElapsed,
        lastTempoChangeMs: state.lastTimeMs,
        tempoBpm: be.newTempoBpm,
      },
      output: {
        tempoBpm: be.newTempoBpm,
        beatsElapsed: state.beatsElapsed,
      },
    };
  }
}

const initialState: BeaterState = {
  lastTimeMs: 0,
  lastTempoChangeMs: 0,
  beatsElapsedAtLastTempoChange: 0,
  tempoBpm: DEFAULT_TEMPO_BPM,
  beatsElapsed: 0,
};

/**
 * Make stateful function that takes time/pause input events and returns beat
 * events, handling state internally.
 */
export function makeBeater() {
  return makeStateMachine<BeaterState, BeaterEvent, BeaterOutput>(
    initialState,
    beatsElapsed,
  );
}
