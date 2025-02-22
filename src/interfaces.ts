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

/** Event type for a high beep sound. */
export interface BeepHigh {
  kind: 'high';
}

/** Event for a high beep sound. */
export const BEEP_HIGH: BeepHigh = { kind: 'high' };

/** Event type for a mid beep sound. */
export interface BeepMid {
  kind: 'mid';
}

/** Event for a mid beep sound. */
export const BEEP_MID = { kind: 'mid' };

/** Event type for a low beep sound. */
export interface BeepLow {
  kind: 'low';
}

/** Event for a low beep sound. */
export const BEEP_LOW = { kind: 'low' };

/** Event type for a beep sound. */
export type BeepEvent = BeepHigh|BeepMid|BeepLow;
