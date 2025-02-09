import { BlipSink } from '../patcher/blip_sink.js';
import { BlipReceiver, TriggerableStream } from '../patcher/blip_stream.js';
import { Transform } from '../patcher/blip_transformer.js';
import { Muxed } from '../patcher/mux.js';
import { PauserOutput } from '../pauser/pauser.js';
import {
  BeaterEvent,
  BeaterOutput,
  makeBeater,
  NewTime,
  makeTimeEvent,
  NewTempo,
  makeTempoEvent,
} from './beater.js';
import {
  beaterOutputToMetric,
  CompletedMetricBeat,
  makeCompletedBeatTicker,
} from './subdivider.js';
import { BeaterElement } from './element.js';

export class BeaterComponent {
  box: HTMLDivElement;
  private element: BeaterElement;
  receiver: BlipReceiver<PauserOutput>;

  constructor(doc: Document) {
    const timeEvents = new Transform<PauserOutput, NewTime>(
      (po: PauserOutput) => makeTimeEvent(po.elapsed),
    );

    // Expose only the receiver interface publicly.
    this.receiver = timeEvents;

    const tempoEvents = new TriggerableStream<NewTempo>();

    // Tempo seems "stuck," can't be moved. Investigate via test page.
    const element = new BeaterElement(doc, (tempoBpm) =>
      setTimeout(() => tempoEvents.trigger(makeTempoEvent(tempoBpm)), 0),
    );

    const beaterEvents = new Muxed<BeaterEvent>([timeEvents, tempoEvents]);

    this.box = element.box;

    const beater = new Transform(makeBeater());
    beaterEvents.pipe(beater);

    beater.pipe(
      new BlipSink<BeaterOutput>((bo: BeaterOutput) => {
        element.updateTempo(bo.tempoBpm);
        element.updateTotalBeats(bo.beatsElapsed);
      }),
    );

    const subdivider = new Transform(beaterOutputToMetric);
    beater.pipe(subdivider);

    const ticker = new Transform(makeCompletedBeatTicker());
    subdivider.pipe(ticker);

    ticker.pipe(
      new BlipSink<CompletedMetricBeat>((b: CompletedMetricBeat) => {
        element.updateCompletedMetricBeat(b);
      }),
    );
  }
}
