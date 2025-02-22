import { CompletedMetricBeat } from '../../interfaces.js';
import { BlipReceiver, TriggerableStream } from '../../patcher/blip_stream.js';
import { BlipSink } from '../../patcher/blip_sink.js';

export type DrumDecider<DrumEnum extends number> = (
  b: CompletedMetricBeat
) => readonly DrumEnum[];

enum BasicDrums {
  HIHAT,
  SNARE,
  KICK,
}

const basicDecider: DrumDecider<BasicDrums> = (beat) => {
  if (beat.sixteenth !== 1 || beat.eighth !== 1) {
    return [BasicDrums.HIHAT];
  }
  if (beat.quarter % 2 === 0) {
    return [BasicDrums.HIHAT, BasicDrums.SNARE];
  }
  return [BasicDrums.HIHAT, BasicDrums.KICK];
};

export type DrumFactory = (ctx: AudioContext) => () => void;

export type DrumFactoryMap<DrumEnum extends number> = {
  [key in DrumEnum]: DrumFactory;
};

export function makeDrumKit<DrumEnum extends number>(
  ctx: AudioContext,
  beatToDrumList: (b: CompletedMetricBeat) => readonly DrumEnum[],
  drumFactoryMap: DrumFactoryMap<DrumEnum>
): BlipReceiver<CompletedMetricBeat> {
  const triggerables: { [key in DrumEnum]?: TriggerableStream<unknown> } = {};
  for (const [drum, factory] of Object.entries(drumFactoryMap)) {
    const sink = new BlipSink((factory as DrumFactory)(ctx));
    triggerables[drum] = new TriggerableStream<unknown>();
    triggerables[drum].pipe(sink);
  }
  return new BlipSink((b) => {
    for (const drum of beatToDrumList(b)) {
      triggerables[drum]!.trigger(null);
    }
  });
}
