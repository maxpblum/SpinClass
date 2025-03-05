import { makeStateMachine } from '../blip.js';
import {
  getHead,
  getTail,
  isEmptyList,
  makeList,
  LinkedList,
} from '../linked_list.js';
import { NewTime, NewTempo, makeTempoEvent } from '../interfaces.js';

interface Change {
  tempo: number;
  time: DOMHighResTimeStamp;
}

interface State {
  // These should be in chronological order, earliest first (i.e. earliest at
  // the "head" end of the list).
  changes: LinkedList<Change>;
}

const initialState: State = {
  changes: makeList([
    { tempo: 50, time: 0 },
    { tempo: 60, time: 1000 },
    { tempo: 70, time: 2000 },
    { tempo: 80, time: 3000 },
    { tempo: 90, time: 4000 },
    { tempo: 100, time: 5000 },
  ]),
};

function reducer(
  s: State,
  input: NewTime
): { newState: State; output?: NewTempo } {
  let changes: LinkedList<Change> = s.changes;
  let output: NewTempo | null = null;
  while (!isEmptyList(changes)) {
    if (getHead<Change>(changes).time <= input.newTimeMs) {
      output = makeTempoEvent(getHead<Change>(changes).tempo);
      changes = getTail(changes);
    } else {
      break;
    }
  }
  return output ? { newState: { changes }, output } : { newState: { changes } };
}

/** Get a tempo-scheduling state machine. */
export function makeTempoScheduler() {
  return makeStateMachine<State, NewTime, NewTempo>(initialState, reducer);
}
