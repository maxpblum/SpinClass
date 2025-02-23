import { TriggerableStream, BlipSink, Transform, makeStateMachine } from '../src/blip.js';

describe('BlipSink', () => {
  it('runs the handler on incoming blips', async () => {
    const inputs = new TriggerableStream();
    const sideEffects: string[] = [];
    const sink = new BlipSink<number>((num: number) => {
      sideEffects.push(`side effect for num ${num}`);
    });
    inputs.pipe(sink);

    inputs.trigger(11);
    inputs.trigger(22);
    inputs.trigger(33);

    expect(sideEffects).toEqual([
      'side effect for num 11',
      'side effect for num 22',
      'side effect for num 33',
    ]);
  });
});

describe('Transform', () => {
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

describe('makeStateMachine', () => {
  it('returns a stateful function', () => {
    const sm = makeStateMachine(0, (sum: number, toAdd: number) => {
      const newSum = sum + toAdd;
      return {
        newState: newSum,
        output: newSum,
      };
    });
    expect(sm(1)).toEqual(1);
    expect(sm(5)).toEqual(6);
    expect(sm(-3)).toEqual(3);
  });
});
