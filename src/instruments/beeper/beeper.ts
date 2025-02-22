import { BlipSink } from '../../patcher/blip_sink.js';
import { BlipReceiver } from '../../patcher/blip_stream.js';
import { Transform } from '../../patcher/blip_transformer.js';
import {
  BeepEvent,
  BEEP_HIGH,
  BEEP_MID,
  BEEP_LOW,
  CompletedMetricBeat,
} from '../../interfaces.js';

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

const makeHandler: (beeper: Beeper) => (e: BeepEvent) => void =
  (beeper: Beeper) => (e: BeepEvent) => {
    switch (e.kind) {
      case 'high':
        beeper.beepHigh();
        return;
      case 'mid':
        beeper.beepMid();
        return;
      case 'low':
        beeper.beepLow();
        return;
    }
  };

function beatToBeep(beat: CompletedMetricBeat): BeepEvent {
  if (beat.sixteenth === 2 || beat.eighth === 2) {
    // Not a quarter-note beat.
    return BEEP_LOW;
  }
  if (beat.quarter === 1) {
    // Downbeat.
    return BEEP_HIGH;
  }
  // Non-downbeat quarter-note beat.
  return BEEP_MID;
}

/** Blip receiver that emits beeps according to beat position. */
export function makeTempoBeeper(
  ctx: AudioContext
): BlipReceiver<CompletedMetricBeat> {
  const beepSink = new BlipSink<BeepEvent>(makeHandler(new Beeper(ctx)));
  const transform = new Transform<CompletedMetricBeat, BeepEvent>(beatToBeep);
  transform.pipe(beepSink);
  return transform;
}
