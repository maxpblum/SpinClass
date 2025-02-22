import { CompletedMetricBeat } from '../interfaces.js';

const GREEN_CIRCLE = '🟢';
const WHITE_CIRCLE = '⚪';

/** Exposes a div showing the current beat. */
class WhichBeat {
  box: HTMLDivElement;
  private circles: HTMLDivElement[] = [];

  constructor(
    private doc: Document,
    name: string,
    beatCount: number,
  ) {
    this.box = doc.createElement('div');
    this.box.classList.add('beater-which-beat', `beater-which-${name}-beat`);

    for (let i = 0; i < beatCount; i++) {
      const circle = doc.createElement('div');
      circle.classList.add('beater-which-beat-circle');
      circle.innerText = WHITE_CIRCLE;
      this.circles.push(circle);
      this.box.appendChild(circle);
    }
  }

  updateBeat(beat: number) {
    this.circles.forEach((c, i) => {
      c.innerText = i + 1 === beat ? GREEN_CIRCLE : WHITE_CIRCLE;
    });
  }
}

export class BeaterElement {
  box: HTMLDivElement;
  private tempoInput: HTMLInputElement;
  private tempoLabel: HTMLDivElement;
  private totalBeatsLabel: HTMLDivElement;
  private measureLabel: HTMLDivElement;
  private whichQuarterBeat: WhichBeat;
  private whichEighthBeat: WhichBeat;
  private whichSixteenthBeat: WhichBeat;

  constructor(private doc: Document) {
    this.box = doc.createElement('div');
    this.box.classList.add('beater-box');

    this.totalBeatsLabel = doc.createElement('div');
    this.totalBeatsLabel.classList.add('beater-total-beats-label');
    this.updateTotalBeats(0);
    this.box.appendChild(this.totalBeatsLabel);

    this.measureLabel = doc.createElement('div');
    this.measureLabel.classList.add('beater-measure-label');
    this.box.appendChild(this.measureLabel);

    const quarterBeatLabel = doc.createElement('div');
    quarterBeatLabel.innerText = '♩';
    this.box.appendChild(quarterBeatLabel);
    this.whichQuarterBeat = new WhichBeat(doc, 'quarter', 4);
    this.box.appendChild(this.whichQuarterBeat.box);

    const eighthBeatLabel = doc.createElement('div');
    eighthBeatLabel.innerText = '♪';
    this.box.appendChild(eighthBeatLabel);
    this.whichEighthBeat = new WhichBeat(doc, 'eighth', 2);
    this.box.appendChild(this.whichEighthBeat.box);

    const sixteenthBeatLabel = doc.createElement('div');
    sixteenthBeatLabel.innerText = '♬';
    this.box.appendChild(sixteenthBeatLabel);
    this.whichSixteenthBeat = new WhichBeat(doc, 'sixteenth', 2);
    this.box.appendChild(this.whichSixteenthBeat.box);

    this.updateCompletedMetricBeat({
      measure: 0,
      quarter: 1,
      eighth: 1,
      sixteenth: 1,
    });
  }

  updateTotalBeats(num: number) {
    this.totalBeatsLabel.innerText = `B: ${num}`;
  }

  updateCompletedMetricBeat(b: CompletedMetricBeat) {
    this.measureLabel.innerText = `M: ${b.measure}`;
    this.whichQuarterBeat.updateBeat(b.quarter);
    this.whichEighthBeat.updateBeat(b.eighth);
    this.whichSixteenthBeat.updateBeat(b.sixteenth);
  }
}
