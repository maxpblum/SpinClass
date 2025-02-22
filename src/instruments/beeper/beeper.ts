import { BlipSink } from '../../patcher/blip_sink.js';
import { BeepEvent } from '../../interfaces.js';

class Beeper {
  private readonly oscNode: OscillatorNode;
  private readonly gainNode: GainNode;

  constructor(private readonly ctx: AudioContext) {
    this.oscNode = this.ctx.createOscillator();
    this.oscNode.type = 'square';
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.oscNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.oscNode.start();
  }

  private beep(freq: number) {
    this.oscNode.frequency.setValueAtTime(freq, this.ctx.currentTime);
    this.gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime + 0.05);
  }

  beepHigh() {
    this.beep(600);
  }

  beepLow() {
    this.beep(200);
  }

  beepMid() {
    this.beep(400);
  }
}

const makeHandler: (beeper: Beeper) => (e: BeepEvent) => void =
  (beeper: Beeper) => (e: BeepEvent) => {
    switch (e.kind) {
      case 'high':
        beeper.beepHigh();
      case 'mid':
        beeper.beepMid();
      case 'low':
        beeper.beepLow();
    }
  };

/** BlipSink that can emit high, medium, or low beeps. */
export const makeBeeper: (ctx: AudioContext) => BlipSink<BeepEvent> = (
  ctx: AudioContext
) => new BlipSink<BeepEvent>(makeHandler(new Beeper(ctx)));
