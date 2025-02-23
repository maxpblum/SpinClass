import { BlipReceiver } from '../../blip.js';
import { CompletedMetricBeat } from '../../interfaces.js';
import { makeDrumKit } from '../drums/kit.js';

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
    const currentTime = this.ctx.currentTime;
    this.oscNode.frequency.setValueAtTime(freq, currentTime);
    this.gainNode.gain.setValueAtTime(0.5, currentTime);
    this.gainNode.gain.setValueAtTime(0, currentTime + 0.05);
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

enum Level {
  LOW,
  MID,
  HIGH,
}

function beatToBeep(beat: CompletedMetricBeat): readonly Level[] {
  if (beat.sixteenth === 2 || beat.eighth === 2) {
    // Not a quarter-note beat.
    return [Level.LOW];
  }
  if (beat.quarter === 1) {
    // Downbeat.
    return [Level.HIGH];
  }
  // Non-downbeat quarter-note beat.
  return [Level.MID];
}

/** Blip receiver that emits beeps according to beat position. */
export function makeTempoBeeper(
  ctx: AudioContext
): BlipReceiver<CompletedMetricBeat> {
  const beeper = new Beeper(ctx);
  return makeDrumKit(ctx, beatToBeep, {
    [Level.LOW]: () => () => beeper.beepLow(),
    [Level.MID]: () => () => beeper.beepMid(),
    [Level.HIGH]: () => () => beeper.beepHigh(),
  });
}
