// Test everything together.
import { PauserComponent } from './pauser/component.js';
import { ClockComponent } from './clock/component.js';
import { BeaterComponent } from './beater/component.js';
import { TempoComponent } from './tempo/component.js';
import { makeTempoBeeper } from './instruments/beeper/beeper.js';

function doTest() {
  const tempo = new TempoComponent(document);
  const pauser = new PauserComponent(document);
  const clock = new ClockComponent(document);
  const beater = new BeaterComponent(document);
  pauser.output.pipe(beater.timeReceiver);
  pauser.output.pipe(clock);
  tempo.output.pipe(beater.tempoReceiver);
  beater.output.pipe(makeTempoBeeper(new AudioContext()));
  document.body.appendChild(tempo.box);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
  document.body.appendChild(clock.box);
}

const btn = document.createElement('button');
btn.innerText = 'Test everything together';
btn.addEventListener('click', doTest);
document.body.appendChild(btn);
