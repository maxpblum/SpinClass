import { BlipReceiver, BlipSink } from '../../blip.js';
import { NewPitch } from '../../interfaces.js';

class Sustain {
  private readonly gainNode: GainNode;
  private readonly oscNode: OscillatorNode;

  constructor(private readonly ctx: AudioContext) {
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.connect(ctx.destination);

    this.oscNode = ctx.createOscillator();
    this.oscNode.type = 'square';
    this.oscNode.frequency.setValueAtTime(440, this.ctx.currentTime);
    this.oscNode.connect(this.gainNode);
    this.oscNode.start();
  }

  setPitch(pitch: number) {
    this.oscNode.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    this.gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);
  }
}

/** Monophonic square wave instrument. */
export function makeSustainer(ctx: AudioContext): BlipReceiver<NewPitch> {
  const s = new Sustain(ctx);
  return new BlipSink<NewPitch>((p: number) => s.setPitch(p));
}
