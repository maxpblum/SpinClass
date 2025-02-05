import { makeStateMachine } from '../patcher/state_machine.js';

export interface BeaterState {
  lastTimeMs: DOMHighResTimeStamp;
  lastTempoChangeMs: DOMHighResTimeStamp;
  beatsElapsedAtLastTempoChange: number;
  tempoBpm: number;
  beatsElapsed: number;
}

export interface NewTime {
  kind: 'newtime';
  newTimeMs: DOMHighResTimeStamp;
}

export function makeTimeEvent(ts: DOMHighResTimeStamp): NewTime {
  return { kind: 'newtime', newTimeMs: ts };
}

export interface NewTempo {
  kind: 'newtempo';
  newTempoBpm: number;
}

export function makeTempoEvent(tempoBpm: number): NewTempo {
  return { kind: 'newtempo', newTempoBpm: tempoBpm };
}

export type BeaterEvent = NewTime | NewTempo;

export interface BeaterOutput {
  tempoBpm: number;
  beatsElapsed: number;
}

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
  tempoBpm: 100,
  beatsElapsed: 0,
};

export function makeBeater() {
  return makeStateMachine<BeaterState, BeaterEvent, BeaterOutput>(
    initialState,
    beatsElapsed
  );
}
