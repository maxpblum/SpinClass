import { NewTempo, makeTempoEvent } from '../interfaces.js';
import { BlipStream, TriggerableStream } from '../blip.js';
import { getTempoElement } from './element.js';

/** Logic and UI for controlling tempo and emitting beat events. */
export class TempoComponent {
  /** Outer UI element to put into DOM. */
  readonly box: HTMLDivElement;

  private triggerableStream: TriggerableStream<NewTempo> =
    new TriggerableStream<NewTempo>();

  /** Stream of beat events. */
  readonly output: BlipStream<NewTempo> = this.triggerableStream;

  constructor(doc: Document) {
    this.box = getTempoElement(doc, (tempoBpm: number) => {
      this.triggerableStream.trigger(makeTempoEvent(tempoBpm));
    });
  }
}
