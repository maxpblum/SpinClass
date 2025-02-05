import { PauserOutput } from './pauser.js';
import { TriggerableStream } from '../patcher/triggerable.js';

export class PauserElement {
  box: HTMLDivElement;
  pausedStates = new TriggerableStream<boolean>();
  private btn: HTMLButtonElement;
  private elapsedStateBox: HTMLDivElement;
  private pausedStateBox: HTMLDivElement;
  private paused: boolean = true;
  private elapsed: DOMHighResTimeStamp = -1;

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

    this.btn.addEventListener('click', () => {
      this.pausedStates.trigger(!this.paused);
    });
  }

  setElapsedStateBoxText() {
    this.elapsedStateBox.innerText = String(this.elapsed);
  }

  setPausedStateBoxText() {
    this.pausedStateBox.innerText = this.paused ? 'Paused' : 'Running';
  }

  handlePauserOutput(output: PauserOutput) {
    this.paused = output.paused;
    this.elapsed = output.elapsed;
    this.setPausedStateBoxText();
    this.setElapsedStateBoxText();
  }
}
