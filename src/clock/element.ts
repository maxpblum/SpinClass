export class ClockElement {
  box: HTMLDivElement;

  constructor(private doc: Document) {
    this.box = doc.createElement('div');
    this.box.classList.add('clock-box');
    this.updateTime('00:00');
  }

  updateTime(time: string) {
    this.box.innerText = time;
  }
}
