// Test everything together.
import { PauserComponent } from './pauser/component.js';
import { ClockComponent } from './clock/component.js';
import { BeaterComponent } from './beater/component.js';
import { TempoComponent } from './tempo/component.js';
import { makeTempoBeeper } from './instruments/beeper/beeper.js';
import { make808 } from './instruments/drums/808.js';

function doTestWithBeeper() {
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

const beeperTestBtn = document.createElement('button');
beeperTestBtn.innerText = 'Test everything together with beeper';
beeperTestBtn.addEventListener('click', doTestWithBeeper);
document.body.appendChild(beeperTestBtn);

function doTestWith808() {
  const tempo = new TempoComponent(document);
  const pauser = new PauserComponent(document);
  const clock = new ClockComponent(document);
  const beater = new BeaterComponent(document);
  pauser.output.pipe(beater.timeReceiver);
  pauser.output.pipe(clock);
  tempo.output.pipe(beater.tempoReceiver);
  beater.output.pipe(make808(new AudioContext()));
  document.body.appendChild(tempo.box);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
  document.body.appendChild(clock.box);
}

const test808Btn = document.createElement('button');
test808Btn.innerText = 'Test everything together with 808';
test808Btn.addEventListener('click', doTestWith808);
document.body.appendChild(test808Btn);
