import { TempoComponent } from '../tempo/component.js';
import { PauserComponent } from '../pauser/component.js';
import { BeaterComponent } from './component.js';

function doTest() {
  const tempo = new TempoComponent(document);
  const pauser = new PauserComponent(document);
  const beater = new BeaterComponent(document);
  pauser.output.pipe(beater.timeReceiver);
  tempo.output.pipe(beater.tempoReceiver);
  document.body.appendChild(tempo.box);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
}

const btn = document.createElement('button');
btn.innerText = 'Test Beater';
btn.addEventListener('click', doTest);
document.body.appendChild(btn);
