import { CompletedMetricBeat } from '../../interfaces.js';
import { BlipReceiver, TriggerableStream, BlipSink } from '../../blip.js';

/** Type for custom functions that take beats and decide which drums to play. */
export type DrumDecider<DrumEnum extends number> = (
  b: CompletedMetricBeat
) => readonly DrumEnum[];

enum BasicDrums {
  HIHAT,
  SNARE,
  KICK,
}

// Temporarily disable no-unused-vars because I expect to use this soon.
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const basicDecider: DrumDecider<BasicDrums> = (beat) => {
  if (beat.sixteenth !== 1 || beat.eighth !== 1) {
    return [BasicDrums.HIHAT];
  }
  if (beat.quarter % 2 === 0) {
    return [BasicDrums.HIHAT, BasicDrums.SNARE];
  }
  return [BasicDrums.HIHAT, BasicDrums.KICK];
};

/** Type for a function that plays a drum noise. */
export type Drum = () => void;

/** Type for a map from drum references to noisemakers. */
export type DrumMap<DrumEnum extends number> = {
  [key in DrumEnum]: Drum;
};

/** Make drumkit that takes beat-event inputs and plays drums. */
export function makeDrumKit<DrumEnum extends number>(
  ctx: AudioContext,
  drumDecider: DrumDecider<DrumEnum>,
  drumMap: DrumMap<DrumEnum>
): BlipReceiver<CompletedMetricBeat> {
  return new BlipSink((b) => {
    for (const drum of drumDecider(b)) {
      drumMap[drum]!.();
    }
  });
}
