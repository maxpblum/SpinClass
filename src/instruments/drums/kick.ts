// I expect to delete this file.
/* eslint-disable */
import { BlipSink } from '../../blip.js';

const LOW_OSC_START_FREQ = 50;
const LOW_OSC_END_FREQ = 10;
const LOW_OSC_SUSTAIN = 0.05;
const LOW_OSC_DECAY = 0.05;

/**
 * Make a kick drum sound right now.
 * @param ctx
 */
export function makeKickDrum(ctx: AudioContext): BlipSink<unknown> {
  const lowOsc = ctx.createOscillator();
  lowOsc.type = 'square';
  function scheduleLow(time: number) {
    lowOsc.frequency.setValueAtTime(LOW_OSC_START_FREQ, time);
    lowOsc.frequency.setValueAtTime(LOW_OSC_START_FREQ, time + LOW_OSC_SUSTAIN);
    lowOsc.frequency.linearRampToValueAtTime(
      LOW_OSC_END_FREQ,
      time + LOW_OSC_SUSTAIN + LOW_OSC_DECAY,
    );
  }

  const gainNode = ctx.createGain();
  function scheduleGain(time: number) {
    gainNode.gain.setValueAtTime(LOW_OSC_START_FREQ, time);
    gainNode.gain.setValueAtTime(LOW_OSC_START_FREQ, time + LOW_OSC_SUSTAIN);
    gainNode.gain.linearRampToValueAtTime(
      LOW_OSC_END_FREQ,
      time + LOW_OSC_SUSTAIN + LOW_OSC_DECAY,
    );
  }

  lowOsc.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);

  lowOsc.start();

  return new BlipSink<unknown>((event: unknown) => {
    scheduleLow(ctx.currentTime);
    scheduleGain(ctx.currentTime);
  });
}
