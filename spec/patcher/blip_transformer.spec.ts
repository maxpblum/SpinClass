import { BlipSink } from '../../src/patcher/blip_sink.js';
import { BlipStreamFromArray } from '../../src/patcher/blip_stream.js';
import { Transform } from '../../src/patcher/blip_transformer.js';

describe('Transform', () => {
  it('emits blips transformed', async () => {
    const inputNums = new BlipStreamFromArray([11, 22, 33]);
    const timesTwo = new Transform((num: number) => num * 2);
    const emittedNums: number[] = [];
    const sink = new BlipSink((num: number) => emittedNums.push(num));

    timesTwo.pipe(sink);
    inputNums.pipe(timesTwo);

    expect(emittedNums).toEqual([22, 44, 66]);
  });
});
