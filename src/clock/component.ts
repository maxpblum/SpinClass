import { toTimeString } from './clock.js';
import { ClockElement } from './element.js';
import { BlipSink } from '../patcher/blip_sink.js';
import { TriggerableStream } from '../patcher/blip_stream.js';
import { Transform } from '../patcher/blip_transformer.js';
import { PauserOutput } from '../interfaces.js';

export class ClockComponent extends BlipSink<PauserOutput> {
  box: HTMLDivElement;

  constructor(doc: Document) {
    const element = new ClockElement(doc);
    const inputStream = new TriggerableStream<PauserOutput>();
    const timestampStream = new Transform((po: PauserOutput) => po.elapsed);
    inputStream.pipe(timestampStream);
    const timeStringStream = new Transform(toTimeString);
    timestampStream.pipe(timeStringStream);
    const timeStringSink = new BlipSink<string>(
      element.updateTime.bind(element),
    );
    timeStringStream.pipe(timeStringSink);
    super((po: PauserOutput) => {
      inputStream.trigger(po);
    });
    this.box = element.box;
  }
}
