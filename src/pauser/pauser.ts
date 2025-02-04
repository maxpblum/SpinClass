interface PauserState {
  readonly paused: boolean;
  readonly elapsed: DOMHighResTimeStamp;
  readonly lastUpstreamTime: DOMHighResTimeStamp;
}

interface Pause {
  readonly kind: 'pause';
}

interface Resume {
  readonly kind: 'resume';
}

interface UpstreamTime {
  readonly kind: 'upstreamtime';
  readonly time: DOMHighResTimeStamp;
}

type PauserEvent = Pause|Resume|UpstreamTime;

const initialState: PauserState = {
  paused: true;
  elapsed: 0;
};

function reducer(state: PauserState, input: PauserEvent) {
  if (input.kind == 'upstreamtime') {
    if (input.paused) {
      return {
        paused: true,
        elapsed: state.elapsed,
        lastUpstreamTime: input.time,
      };
    }
    return {
      paused: false,
      elapsed: state.elapsed + (input.time - state.lastUpstreamTime),
    };
  }
}

class Pauser extends StateMachine<PauserState, UpstreamTime, PauserOutput> {
  static create(): Pauser {
    return new Pauser(initialState, )
  }
}
