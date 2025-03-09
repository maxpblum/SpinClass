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
  Triad,
  sameTriad,
  major,
  r,
  l,
  p,
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
    makeStateMachine<Triad, CompletedMetricBeat, NewPitchSet>(
      major(TWELVE_TONES[0]),
      (prevTriad, beat) => {
        if (beat.quarter !== 1 || beat.eighth !== 1 || beat.sixteenth !== 1) {
          return { newState: prevTriad };
        }
        let triad = prevTriad;
        while (true) {
          console.log('Choosing whether to apply a transform, 80% likelihood.');
          if (!sameTriad(triad, prevTriad) && Math.random() >= 0.8) {
            console.log('No more transforms.');
            break;
          }
          console.log('Applying another transform from R, L, P.');
          const transformIdx = Math.floor(Math.random() * 3);
          const { transformName, transformer } = [
            { transformName: 'R', transformer: r },
            { transformName: 'L', transformer: l },
            { transformName: 'P', transformer: p },
          ][transformIdx];
          console.log(`Chose ${transformName}`);
          triad = transformer(triad);
          console.log(`Current triad candidate: ${triadName(triad)}`);
        }
        console.log(`Chosen triad: ${triadName(triad)}`);
        const newSet = Array.from(
          mapTriadToRange(
            triad,
            DEFAULT_ARPEGGIO_RANGE_MIN,
            DEFAULT_ARPEGGIO_RANGE_MAX,
          ),
        );
        return {
          newState: triad,
          output: { kind: 'newpitchset', pitches: newSet },
        };
      },
    ),
  );
}
