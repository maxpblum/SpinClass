import { BlipTransformer } from "../../src/patcher/blip_transformer.js";

describe("BlipTransformer", () => {
  it("emits blips transformed", async () => {
    async function* emitThreeNums() {
      yield 11;
      yield 22;
      yield 33;
    }
    const timesTwo = new BlipTransformer<number, number>(
      emitThreeNums(),
      (num: number) => num * 2
    );
    const emittedNums: number[] = [];
    for await (const num of timesTwo.outBlips()) {
      emittedNums.push(num);
    }
    expect(emittedNums).toEqual([22, 44, 66]);
  });
});
