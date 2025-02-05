import {PauserComponent} from '../pauser/component.js';
import {ClockComponent} from '../clock/component.js';

function doTest() {
  const pauser = new PauserComponent(document);
  const clock = new ClockComponent(document);
  pauser.output.pipe(clock);
  document.body.appendChild(pauser.box);
  document.body.appendChild(clock.box);
}

const btn = document.createElement('button');
btn.innerText = 'Test pauser with clock';
btn.addEventListener('click', doTest);
document.body.appendChild(btn);
