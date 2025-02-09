import { BlipSink } from '../../src/patcher/blip_sink.js';
import { TriggerableStream } from '../../src/patcher/blip_stream.js';
import { Transform } from '../../src/patcher/blip_transformer.js';

fdescribe('Transform', () => {
  it('emits blips transformed', async () => {
    const inputNums = new TriggerableStream();
    const timesTwo = new Transform((num: number) => num * 2);
    const emittedNums: number[] = [];
    const sink = new BlipSink((num: number) => emittedNums.push(num));
    timesTwo.pipe(sink);
    inputNums.pipe(timesTwo);

    inputNums.trigger(11);
    inputNums.trigger(22);
    inputNums.trigger(33);

    expect(emittedNums).toEqual([22, 44, 66]);
  });
});
