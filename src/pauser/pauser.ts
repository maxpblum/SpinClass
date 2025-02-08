import { makeStateMachine } from '../patcher/state_machine.js';

interface PauserState {
  readonly paused: boolean;
  readonly elapsed: DOMHighResTimeStamp;
  readonly lastUpstreamTime: DOMHighResTimeStamp;
}

export interface PauserOutput {
  readonly paused: boolean;
  readonly elapsed: DOMHighResTimeStamp;
}

type Pause = {
  readonly kind: 'pause';
};

export const PAUSE_EVENT: Pause = { kind: 'pause' };

type Resume = {
  readonly kind: 'resume';
};

export const RESUME_EVENT: Resume = { kind: 'resume' };

type UpstreamTime = {
  readonly kind: 'upstreamtime';
  readonly time: DOMHighResTimeStamp;
};

export function makeTimeEvent(time: DOMHighResTimeStamp): UpstreamTime {
  return { kind: 'upstreamtime', time };
}

export type PauserEvent = Pause | Resume | UpstreamTime;

const initialState: PauserState = {
  paused: true,
  elapsed: 0,
  lastUpstreamTime: -1,
};

function reducer(state: PauserState, input: PauserEvent) {
  const newState = {
    lastUpstreamTime:
      input.kind === 'upstreamtime' ? input.time : state.lastUpstreamTime,
    paused: input.kind === 'pause' || (state.paused && input.kind !== 'resume'),
    elapsed:
      input.kind === 'upstreamtime' && !state.paused
        ? state.elapsed + input.time - state.lastUpstreamTime
        : state.elapsed,
  };
  return {
    newState,
    output: {
      paused: newState.paused,
      elapsed: newState.elapsed,
    },
  };
}

export function makePauser() {
  return makeStateMachine<PauserState, PauserEvent, PauserOutput>(
    initialState,
    reducer,
  );
}
