import { toTimeString } from './clock.js';
import { ClockElement } from './element.js';
import { BlipSink, TriggerableStream, Transform } from '../blip.js';
import { PauserOutput } from '../interfaces.js';

/** UI component that displays readable clock time. */
export class ClockComponent extends BlipSink<PauserOutput> {
  /** Outer div of UI element to attach to DOM. */
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
