import {makeTimeEvent, makePauser, PauserElement, PauserOutput} from './pauser.js';
import {BlipTransformer} from '../patcher/blip_transformer.js';
import {BlipSink} from '../patcher/blip_sink.js';
import {AnimationFrameStream} from '../patcher/animation_frame_stream.js';

const animationFrameStream = new AnimationFrameStream(requestAnimationFrame.bind(window));
const timeEventStream = new BlipTransformer(animationFrameStream, makeTimeEvent);
const pauserStream = new BlipTransformer(timeEventStream.outBlips(), makePauser());
const pauserEl = new PauserElement(document);
const pauserSink = new BlipSink((output: PauserOutput) => pauserEl.handlePauserOutput(output));
pauserSink.listen(pauserStream.outBlips());
document.body.appendChild(pauserEl.box);
