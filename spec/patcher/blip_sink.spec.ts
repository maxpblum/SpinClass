import { BlipSink } from '../../src/patcher/blip_sink.js';

describe('BlipSink', () => {
  it('runs the handler on incoming blips', async () => {
    const sideEffects: string[] = [];
    const sink = new BlipSink<number>((num: number) => {
      sideEffects.push(`side effect for num ${num}`);
    });
    async function* emitThreeNums() {
      yield 11;
      yield 22;
      yield 33;
    }
    await sink.listen(emitThreeNums());
    expect(sideEffects).toEqual([
      'side effect for num 11',
      'side effect for num 22',
      'side effect for num 33',
    ]);
  });
});
