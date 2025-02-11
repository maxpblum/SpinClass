/** Default tempo to share in all places that need one. */
export const DEFAULT_TEMPO_BPM = 100;

/** Event containing a DOMHighResTimeStamp. */
export interface NewTime {
  kind: 'newtime';
  newTimeMs: DOMHighResTimeStamp;
}

/** Create an event containing a DOMHighResTimeStamp. */
export function makeTimeEvent(ts: DOMHighResTimeStamp): NewTime {
  return { kind: 'newtime', newTimeMs: ts };
}

/** Event containing a new tempo. */
export interface NewTempo {
  kind: 'newtempo';
  newTempoBpm: number;
}

/** Create an event containing a new tempo. */
export function makeTempoEvent(tempoBpm: number): NewTempo {
  return { kind: 'newtempo', newTempoBpm: tempoBpm };
}
