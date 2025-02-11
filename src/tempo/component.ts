import { NewTempo, makeTempoEvent } from '../interfaces.js';
import { BlipStream, TriggerableStream } from '../patcher/blip_stream.js';
import { getTempoElement } from './element.js';

export class TempoComponent {
  readonly box: HTMLDivElement;
  private triggerableStream: TriggerableStream<NewTempo> =
    new TriggerableStream<NewTempo>();
  readonly output: BlipStream<NewTempo> = this.triggerableStream;

  constructor(doc: Document) {
    this.box = getTempoElement(doc, (tempoBpm: number) => {
      this.triggerableStream.trigger(makeTempoEvent(tempoBpm));
    });
  }
}
