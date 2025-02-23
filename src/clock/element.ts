/** UI element that displays readable time. */
export class ClockElement {
  /** Outer div to attach to DOM. */
  box: HTMLDivElement;

  constructor(private doc: Document) {
    this.box = doc.createElement('div');
    this.box.classList.add('clock-box');
    this.updateTime('00:00');
  }

  /** Set the readable time. */
  updateTime(time: string) {
    this.box.innerText = time;
  }
}
