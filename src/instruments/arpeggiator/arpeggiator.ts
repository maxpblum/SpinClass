import {
  CompletedMetricBeat,
  NewPitchSet,
  NewPitch,
  PitchSet,
} from '../../interfaces.js';
import { Transform, makeStateMachine } from '../../blip.js';
import {
  TWELVE_TONES,
  mapTriadToRange,
  triadName,
  DEFAULT_ARPEGGIO_RANGE_MIN,
  DEFAULT_ARPEGGIO_RANGE_MAX,
  major,
  minor,
} from '../../pitch/pitch.js';

/** Get an array that is a shuffled copy of an iterable. */
function shuffled<T>(ts: Iterable<T>): T[] {
  const output: T[] = [];
  for (const t of ts) {
    output.splice(Math.floor(Math.random() * (output.length + 1)), 0, t);
  }
  return output;
}

interface ArpeggiatorState {
  pitches: PitchSet;
  index: number;
}

/**
 * Make a transform that takes pitch set changes and beat updates and emits new
 * pitches according to an arpeggio pattern.
 */
export function makeArpeggiator(): Transform<
  CompletedMetricBeat | NewPitchSet,
  NewPitch
> {
  return new Transform<CompletedMetricBeat | NewPitchSet, NewPitch>(
    makeStateMachine<
      ArpeggiatorState,
      CompletedMetricBeat | NewPitchSet,
      NewPitch
    >({ pitches: [], index: 0 }, (state, event) => {
      if ((event as NewPitchSet).kind === 'newpitchset') {
        return {
          newState: {
            pitches: shuffled((event as NewPitchSet).pitches),
            index: 0,
          },
        };
      }
      let index = state.index;
      if (index >= state.pitches.length) {
        index = 0;
      }
      if (state.pitches.length > 0) {
        return {
          newState: { pitches: state.pitches, index: index + 1 },
          output: state.pitches[index],
        };
      }
      return { newState: state };
    }),
  );
}

/** Get a stream of new pitch sets chosen randomly. */
export function makePitchSetShuffler(): Transform<
  CompletedMetricBeat,
  NewPitchSet
> {
  return new Transform<CompletedMetricBeat, NewPitchSet>(
    makeStateMachine<PitchSet, CompletedMetricBeat, NewPitchSet>(
      [],
      (prevSet, beat) => {
        if (beat.quarter !== 1 || beat.eighth !== 1 || beat.sixteenth !== 1) {
          return { newState: prevSet };
        }
        const triadBuilder = Math.random() >= 0.5 ? major : minor;
        const rootPitch = TWELVE_TONES[Math.floor(Math.random() * 12)];
        const triad = triadBuilder(rootPitch);
        console.log(`Root: ${rootPitch.name}, triad: ${triadName(triad)}`);
        const newSet = Array.from(
          mapTriadToRange(
            triad,
            DEFAULT_ARPEGGIO_RANGE_MIN,
            DEFAULT_ARPEGGIO_RANGE_MAX,
          ),
        );
        console.log(`New set: ${newSet}`);
        return {
          newState: newSet,
          output: { kind: 'newpitchset', pitches: newSet },
        };
      },
    ),
  );
}
