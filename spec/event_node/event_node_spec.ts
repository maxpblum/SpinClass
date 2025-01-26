import { EventNode } from "../../src/event_node/event_node.js";

describe("EventNode", () => {
  describe("constructor", () => {
    it("does not throw", () => {
      const node = new EventNode<null, null, null, null>({
        processor: () => ({
          newState: null,
          sideEffects: [],
          outputEvents: [],
        }),
        sideEffectDoer: () => {},
        initialState: null,
      });
    });
  });

  describe("listen", () => {
    function getSideEffectsObjects() {
      const sideEffects: string[] = [];
      function doSideEffect(num: number) {
        sideEffects.push(`Side effect ${num}`);
      }
      return { sideEffects, doSideEffect };
    }

    describe("side effects", () => {
      function getTestObjects() {
        const { sideEffects, doSideEffect } = getSideEffectsObjects();

        const node = new EventNode<number, null, number, null>({
          processor: (state: null, event: number) => ({
            newState: null,
            sideEffects: [event, event * 10],
            outputEvents: [],
          }),
          sideEffectDoer: doSideEffect,
          initialState: null,
        });

        return { node, sideEffects };
      }

      it("Does the side effects of one event", async () => {
        const { node, sideEffects } = getTestObjects();

        await node.listen([1]);

        expect(sideEffects).toHaveSize(2);
        expect(sideEffects).toContain("Side effect 1");
        expect(sideEffects).toContain("Side effect 10");
      });

      it("Does side effects for subsequent events", async () => {
        const { node, sideEffects } = getTestObjects();

        await node.listen([1, 2]);

        expect(sideEffects).toHaveSize(4);

        const lastTwo = sideEffects.slice(-2);

        expect(lastTwo).toContain("Side effect 2");
        expect(lastTwo).toContain("Side effect 20");
      });
    });

    describe("state", () => {
      it("Increments state according to the processor function", async () => {
        const { sideEffects, doSideEffect } = getSideEffectsObjects();

        const node = new EventNode<number, number, number, null>({
          processor: (state: number, event: number) => ({
            newState: state + event,
            sideEffects: [state + event],
            outputEvents: [],
          }),
          sideEffectDoer: doSideEffect,
          initialState: 0,
        });

        await node.listen([1, 2, 3]);

        expect(sideEffects).toEqual([
          "Side effect 1",
          "Side effect 3",
          "Side effect 6",
        ]);
      });
    });
  });
});
