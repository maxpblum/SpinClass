import { DEFAULT_TEMPO_BPM, NewTempo } from '../interfaces.js';
import { BlipStream, BlipSink } from '../blip.js';

/**
 * Factory for a tempo control UI element.
 * @param doc The HTML document.
 * @param onTempoChange External handler for when the user chooses a new tempo.
 */
export function getTempoControlElement(
  doc: Document,
  onTempoChange: (tempoBpm: number) => void,
): HTMLDivElement {
  const box = doc.createElement('div');
  box.classList.add('tempo-box');

  const tempoInput = doc.createElement('input');
  tempoInput.classList.add('tempo-input');
  tempoInput.type = 'range';
  tempoInput.min = '1';
  tempoInput.max = '600';
  tempoInput.step = '1';
  tempoInput.valueAsNumber = DEFAULT_TEMPO_BPM;
  tempoInput.addEventListener('change', () => {
    onTempoChange(tempoInput.valueAsNumber);
    tempoLabel.innerText = `Tempo: ${tempoInput.value}`;
  });
  box.appendChild(tempoInput);

  const tempoLabel = doc.createElement('div');
  tempoLabel.classList.add('tempo-label');
  tempoLabel.innerText = `Tempo: ${tempoInput.value}`;
  box.appendChild(tempoLabel);

  return box;
}

/**
 * Factory for a passthrough-only tempo UI element.
 * @param doc The HTML document.
 * @param tempoChanges Stream of tempo changes.
 */
export function getAutomatedTempoElement(
  doc: Document,
  tempoChanges: BlipStream<NewTempo>,
): HTMLDivElement {
  const box = doc.createElement('div');
  box.classList.add('tempo-box');

  const tempoLabel = doc.createElement('div');
  tempoLabel.classList.add('tempo-label');

  function setTempo(tempo: number) {
    tempoLabel.innerText = `Tempo: ${tempo}`;
  }

  setTempo(-1);
  tempoChanges.pipe(new BlipSink<NewTempo>((e) => setTempo(e.newTempoBpm)));

  box.appendChild(tempoLabel);

  return box;
}
