import { PauserOutput } from '../interfaces.js';
import {
  makeTimeEvent,
  makePauser,
  PAUSE_EVENT,
  RESUME_EVENT,
  PauserEvent,
} from './pauser.js';
import { PauserElement } from './element.js';
import {
  BlipStream,
  Transform,
  BlipSink,
  AnimationFrameStream,
  Muxed,
} from '../blip.js';

/**
 * Logic and UI for a millisecond-emitting stopwatch to drive time-based events
 * downstream.
 */
export class PauserComponent {
  /** Outer UI element to attach to DOM. */
  box: HTMLDivElement;

  /** Stream of pause/resume/time events. */
  output: BlipStream<PauserOutput>;

  constructor(doc: Document) {
    const animationFrameStream = new AnimationFrameStream();

    const timeTransformer = new Transform(makeTimeEvent);
    animationFrameStream.pipe(timeTransformer);

    const pauserStream = new Transform<PauserEvent, PauserOutput>(makePauser());

    const pauserEl = new PauserElement(doc);
    const pauserSink = new BlipSink((output: PauserOutput) =>
      pauserEl.handlePauserOutput(output),
    );
    pauserStream.pipe(pauserSink);

    const pauseResumeStream = new Transform((paused: boolean) => {
      return paused ? PAUSE_EVENT : RESUME_EVENT;
    });
    pauserEl.pausedStates.pipe(pauseResumeStream);

    const combinedInputs = new Muxed<PauserEvent>([
      timeTransformer,
      pauseResumeStream,
    ]);

    // Loop back into the pauser stream.
    combinedInputs.pipe(pauserStream);

    this.box = pauserEl.box;
    this.output = pauserStream;
  }
}
