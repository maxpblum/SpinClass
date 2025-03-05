import { makeStateMachine } from '../blip.js';
import {
  getHead,
  getTail,
  isEmptyList,
  makeList,
  LinkedList,
} from '../linked_list.js';
import { PauserOutput, NewTempo, makeTempoEvent } from '../interfaces.js';

interface Change {
  tempo: number;
  // What time the change should [start to] happen in ms.
  time: DOMHighResTimeStamp;
  // How many ms the linear ramp-up to the new tempo should take. Assumed to be
  // zero (instantaneous) if absent.
  duration?: DOMHighResTimeStamp;
}

interface State {
  // These should be in chronological order, earliest first (i.e. earliest at
  // the "head" end of the list). It is assumed that no change happens before
  // the duration of a previous change is over. Such a change will result in
  // undefined behavior.
  changes: LinkedList<Change>;
  // The last tempo we chose that was not an interim tempo part of the way
  // through a linear ramp.
  prevFixedTempo?: number;
}

const initialState: State = {
  changes: makeList([
    { tempo: 50, time: 0 },
    { tempo: 60, time: 1000 },
    { tempo: 70, time: 2000 },
    { tempo: 80, time: 3000 },
    { tempo: 90, time: 4000 },
    { tempo: 100, time: 5000 },
    { tempo: 200, time: 6000, duration: 3000 },
    { tempo: 50, time: 10000, duration: 5000 },
  ]),
};

function reducer(
  s: State,
  input: PauserOutput,
): { newState: State; output?: NewTempo } {
  let changes: LinkedList<Change> = s.changes;
  if (isEmptyList(changes)) {
    return { newState: s };
  }
  let output: NewTempo | null = null;
  let fixedTempo = s.prevFixedTempo ?? 0;
  while (!isEmptyList(changes)) {
    const change = getHead<Change>(changes);
    if (change.time <= input.elapsed) {
      const changeDoneFraction = change.duration
        ? (input.elapsed - change.time) / change.duration
        : 1;
      if (changeDoneFraction >= 1) {
        output = makeTempoEvent(change.tempo);
        fixedTempo = change.tempo;
      } else {
        output = makeTempoEvent(
          fixedTempo + changeDoneFraction * (change.tempo - fixedTempo),
        );
        // The current linear ramp isn't over yet, so don't pop the current
        // change from the list and don't keep iterating.
        break;
      }
      changes = getTail(changes);
    } else {
      break;
    }
  }
  const newState: State = { changes, prevFixedTempo: fixedTempo };
  return output ? { newState, output } : { newState };
}

/** Get a tempo-scheduling state machine. */
export function makeTempoScheduler() {
  return makeStateMachine<State, PauserOutput, NewTempo>(initialState, reducer);
}
