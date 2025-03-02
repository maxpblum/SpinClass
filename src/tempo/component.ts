import { NewTempo, makeTempoEvent } from '../interfaces.js';
import { BlipStream, TriggerableStream, BlipReceiver, BlipSink } from '../blip.js';
import { getTempoControlElement, getAutomatedTempoElement } from './element.js';

class BaseTempoComponent {
  /** Outer UI element to put into DOM. */
  box: HTMLDivElement;

  protected triggerableStream: TriggerableStream<NewTempo> =
    new TriggerableStream<NewTempo>();

  /** Stream of NewTempo events. */
  readonly output: BlipStream<NewTempo> = this.triggerableStream;

}

/** Logic and UI for controlling tempo and emitting tempo change events. */
export class TempoComponent extends BaseTempoComponent {
  constructor(doc: Document) {
    super();
    this.box = getTempoControlElement(doc, (tempoBpm: number) => {
      this.triggerableStream.trigger(makeTempoEvent(tempoBpm));
    });
  }
}

/** Logic and UI for showing tempo and passing through tempo change events. */
export class AutomatedTempoComponent extends BaseTempoComponent {
  private readonly inputEvents = new BlipSink<NewTempo>((t) => this.triggerableStream.trigger(t));
  readonly receiver: BlipReceiver<NewTempo> = this.inputEvents;

  constructor(doc: Document) {
    super();
    this.box = getAutomatedTempoElement(doc, this.output);
  }
}
