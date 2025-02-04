import { BlipStreamFromArray } from '../../src/patcher/blip_stream.js';
import { BlipSink } from '../../src/patcher/blip_sink.js';

describe('BlipSink', () => {
  it('runs the handler on incoming blips', async () => {
    const inputs = new BlipStreamFromArray([11, 22, 33]);
    const sideEffects: string[] = [];
    const sink = new BlipSink<number>((num: number) => {
      sideEffects.push(`side effect for num ${num}`);
    });

    inputs.pipe(sink);

    expect(sideEffects).toEqual([
      'side effect for num 11',
      'side effect for num 22',
      'side effect for num 33',
    ]);
  });
});
