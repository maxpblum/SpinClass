import { PauserComponent } from '../pauser/component.js';
import { BeaterComponent } from './component.js';

function doTest() {
  const pauser = new PauserComponent(document);
  const beater = new BeaterComponent(document);
  pauser.output.pipe(beater.receiver);
  document.body.appendChild(pauser.box);
  document.body.appendChild(beater.box);
}

const btn = document.createElement('button');
btn.innerText = 'Test Beater';
btn.addEventListener('click', doTest);
document.body.appendChild(btn);
