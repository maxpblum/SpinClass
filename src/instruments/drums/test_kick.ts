import { TempoComponent } from '../../tempo/component.js';
import { PauserComponent } from '../../pauser/component.js';
import { BeaterComponent } from '../../beater/component.js';
import { makeKickDrum } from './kick.js';

function doTest() {
  const tempo = new TempoComponent(document);
  const pauser = new PauserComponent(document);
  const beater = new BeaterComponent(document);
  const audioCtx = new AudioContext();
  const kick = makeKickDrum(audioCtx);
  pauser.output.pipe(beater.timeReceiver);
  tempo.output.pipe(beater.tempoReceiver);
  beater.output.pipe(kick);
  document.body.appendChild(tempo.box);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
}

const btn = document.createElement('button');
btn.innerText = 'Test Kick';
btn.addEventListener('click', doTest);
document.body.appendChild(btn);
