// Test everything together.
import { PauserComponent } from './pauser/component.js';
import { ClockComponent } from './clock/component.js';
import { BeaterComponent } from './beater/component.js';
import { makeTempoScheduler } from './tempo/scheduler.js';
import { AutomatedTempoComponent, TempoComponent } from './tempo/component.js';
import { makeTempoBeeper } from './instruments/beeper/beeper.js';
import { make808 } from './instruments/drums/808.js';
import { TriggerableStream, Transform } from './blip.js';
import { NewTempo, makeTempoEvent } from './interfaces.js';
import {
  makeArpeggiator,
  makePitchSetShuffler,
} from './instruments/arpeggiator/arpeggiator.js';
import { makeSustainer } from './instruments/sustain/sustain.js';

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
beeperTestBtn.innerText = '1. Test everything together with beeper';
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
test808Btn.innerText = '2. Test everything together with 808';
test808Btn.addEventListener('click', doTestWith808);
document.body.appendChild(test808Btn);

function doTestWith808AndAutomatedTempo() {
  const tempoStream = new TriggerableStream<NewTempo>();
  const tempo = new AutomatedTempoComponent(document);
  tempoStream.pipe(tempo.receiver);
  tempoStream.trigger(makeTempoEvent(50));
  setTimeout(() => tempoStream.trigger(makeTempoEvent(100)), 1000);
  setTimeout(() => tempoStream.trigger(makeTempoEvent(200)), 2000);
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

const test808AutoTempoBtn = document.createElement('button');
test808AutoTempoBtn.innerText = '3. 808 + automated tempo';
test808AutoTempoBtn.addEventListener('click', doTestWith808AndAutomatedTempo);
document.body.appendChild(test808AutoTempoBtn);

function testTempoScheduler() {
  const pauser = new PauserComponent(document);
  const clock = new ClockComponent(document);
  const tempoChanges = new Transform(makeTempoScheduler());
  const tempo = new AutomatedTempoComponent(document);
  const beater = new BeaterComponent(document);
  pauser.output.pipe(clock);
  pauser.output.pipe(tempoChanges);
  pauser.output.pipe(beater.timeReceiver);
  tempoChanges.pipe(tempo.receiver);
  tempo.output.pipe(beater.tempoReceiver);
  document.body.appendChild(tempo.box);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
  document.body.appendChild(clock.box);
}

const testTempoSchedulerBtn = document.createElement('button');
testTempoSchedulerBtn.innerText = '4. Tempo scheduler';
testTempoSchedulerBtn.addEventListener('click', testTempoScheduler);
document.body.appendChild(testTempoSchedulerBtn);

function testArpeggiator() {
  const tempo = new TempoComponent(document);
  const pauser = new PauserComponent(document);
  const clock = new ClockComponent(document);
  const beater = new BeaterComponent(document);
  const pitchSetShuffler = makePitchSetShuffler();
  const arpeggiator = makeArpeggiator();
  const audioContext = new AudioContext();
  const sustainer = makeSustainer(audioContext);
  pauser.output.pipe(beater.timeReceiver);
  pauser.output.pipe(clock);
  tempo.output.pipe(beater.tempoReceiver);
  beater.output.pipe(pitchSetShuffler);
  beater.output.pipe(arpeggiator);
  beater.output.pipe(make808(audioContext));
  pitchSetShuffler.pipe(arpeggiator);
  arpeggiator.pipe(sustainer);
  document.body.appendChild(tempo.box);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
  document.body.appendChild(clock.box);
}

const testArpeggiatorBtn = document.createElement('button');
testArpeggiatorBtn.innerText = '5. Arpeggiator';
testArpeggiatorBtn.addEventListener('click', testArpeggiator);
document.body.appendChild(testArpeggiatorBtn);
