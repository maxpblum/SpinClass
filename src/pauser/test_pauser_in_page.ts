import {PauserComponent} from './component.js';

function doTest() {
  document.body.appendChild((new PauserComponent(document)).box);
}

const btn = document.createElement('button');
btn.innerText = 'Test Pauser';
btn.addEventListener('click', doTest);
document.body.appendChild(btn);
