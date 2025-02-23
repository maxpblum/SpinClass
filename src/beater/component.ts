import { BlipSink, BlipReceiver, Transform, Muxed } from '../blip.js';
import {
  CompletedMetricBeat,
  NewTime,
  NewTempo,
  PauserOutput,
  makeTimeEvent,
} from '../interfaces.js';
import { BeaterEvent, BeaterOutput, makeBeater } from './beater.js';
import { beaterOutputToMetric, makeCompletedBeatTicker } from './subdivider.js';
import { BeaterElement } from './element.js';

/**
 * Logic and UI for a "beater" that keeps track of elapsed time, including
 * paused state, and emits beat events.
 */
export class BeaterComponent {
  /** Outer div to attach to DOM. */
  readonly box: HTMLDivElement;

  private readonly element: BeaterElement;
  private readonly beater = new Transform(makeBeater());
  private readonly timeEvents = new Transform<PauserOutput, NewTime>(
    (po: PauserOutput) => (po.paused ? null : makeTimeEvent(po.elapsed)),
  );
  private readonly tempoEvents = new Transform<NewTempo, NewTempo>((t) => t);

  /** Receiver for elapsed-time events. */
  readonly timeReceiver: BlipReceiver<PauserOutput> = this.timeEvents;

  /** Receiver for tempo-change events. */
  readonly tempoReceiver: BlipReceiver<NewTempo> = this.tempoEvents;

  private readonly beaterEvents = new Muxed<BeaterEvent>([
    this.timeEvents,
    this.tempoEvents,
  ]);
  private readonly totalBeatsUpdater = new BlipSink<BeaterOutput>(
    (bo: BeaterOutput) => {
      this.element.updateTotalBeats(bo.beatsElapsed);
    },
  );
  private readonly subdivider = new Transform(beaterOutputToMetric);
  private readonly ticker = new Transform(makeCompletedBeatTicker());

  /** Output stream of CompletedMetricBeat events. */
  readonly output = this.ticker;

  private readonly completedBeatUpdater = new BlipSink<CompletedMetricBeat>(
    (b: CompletedMetricBeat) => {
      this.element.updateCompletedMetricBeat(b);
    },
  );

  constructor(doc: Document) {
    this.element = new BeaterElement(doc);
    this.box = this.element.box;
    this.beaterEvents.pipe(this.beater);
    this.beater.pipe(this.totalBeatsUpdater);
    this.beater.pipe(this.subdivider);
    this.subdivider.pipe(this.ticker);
    this.ticker.pipe(this.completedBeatUpdater);
  }
}
