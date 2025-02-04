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

export const PAUSE_EVENT: Pause = {kind: 'pause'};

type Resume = {
  readonly kind: 'resume';
};

export const RESUME_EVENT: Resume = {kind: 'resume'};

type UpstreamTime = {
  readonly kind: 'upstreamtime';
  readonly time: DOMHighResTimeStamp;
};

export function makeTimeEvent(time: DOMHighResTimeStamp): UpstreamTime {
  return {kind: 'upstreamtime', time};
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
    reducer
  );
}

export class PauserElement {
  box: HTMLDivElement;
  private btn: HTMLButtonElement;
  private elapsedStateBox: HTMLDivElement;
  private pausedStateBox: HTMLDivElement;
  private paused: boolean = true;
  private elapsed: DOMHighResTimeStamp = -1;
  private handleNewPausedState: (paused: boolean) => void;
  private nextPausedStatePromise: Promise<boolean>;

  constructor(private doc: Document) {
    this.box = doc.createElement('div');
    this.box.classList.add('pauser-box');

    this.elapsedStateBox = doc.createElement('div');
    this.box.appendChild(this.elapsedStateBox);
    this.elapsedStateBox.classList.add('pauser-elapsed-statebox');
    this.setElapsedStateBoxText();

    this.pausedStateBox = doc.createElement('div');
    this.box.appendChild(this.pausedStateBox);
    this.pausedStateBox.classList.add('pauser-paused-statebox');
    this.setPausedStateBoxText();

    this.btn = doc.createElement('button');
    this.box.appendChild(this.btn);
    this.btn.innerText = 'Pause/Resume';
    this.btn.classList.add('pauser-button');

    this.resetPausedStatePromise();

    this.btn.addEventListener('click', () => {
      this.handleNewPausedState(!this.paused);
    });
  }

  setElapsedStateBoxText() {
    this.elapsedStateBox.innerText = String(this.elapsed);
  }

  setPausedStateBoxText() {
    this.pausedStateBox.innerText = this.paused ? 'Paused' : 'Running';
  }

  resetPausedStatePromise() {
    this.nextPausedStatePromise = new Promise<boolean>((res) => {
      this.handleNewPausedState = res;
    });
  }

  async * pausedStates() {
    while (true) {
      yield await this.nextPausedStatePromise;
      this.resetPausedStatePromise();
    }
  }

  handlePauserOutput(output: PauserOutput) {
    this.paused = output.paused;
    this.elapsed = output.elapsed;
    console.log(`handling ${JSON.stringify(output)}`);
    this.setPausedStateBoxText();
    this.setElapsedStateBoxText();
  }
}
