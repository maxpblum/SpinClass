import {makeTimeEvent, makePauser, PauserOutput, PAUSE_EVENT, RESUME_EVENT, PauserEvent} from './pauser.js';
import {PauserElement} from './element.js';
import {Transform} from '../patcher/blip_transformer.js';
import {BlipSink} from '../patcher/blip_sink.js';
import {AnimationFrameStream} from '../patcher/animation_frame_stream.js';
import {Muxed} from '../patcher/mux.js';

const animationFrameStream = new AnimationFrameStream();

const timeTransformer = new Transform(makeTimeEvent);
animationFrameStream.pipe(timeTransformer);

const pauserStream = new Transform(makePauser());

const pauserEl = new PauserElement(document);
const pauserSink = new BlipSink((output: PauserOutput) => pauserEl.handlePauserOutput(output));
pauserStream.pipe(pauserSink);

const pauseResumeStream = new Transform((paused: boolean) => {
  console.log(`Transforming button click. ${paused}`);
  return paused ? PAUSE_EVENT : RESUME_EVENT;
});
pauserEl.pausedStates.pipe(pauseResumeStream);

const combinedInputs = new Muxed<PauserEvent>([timeTransformer, pauseResumeStream]);

// Loop back into the pauser stream.
combinedInputs.pipe(pauserStream);

document.body.appendChild(pauserEl.box);
