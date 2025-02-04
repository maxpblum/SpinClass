export class BlipTransformer<InBlip, OutBlip> {
  constructor(
    private readonly inBlips: AsyncIterable<InBlip>,
    private readonly transformer: (b: InBlip) => OutBlip,
  ) {}
  async *outBlips(): AsyncGenerator<OutBlip> {
    for await (const inBlip of this.inBlips) {
      yield this.transformer(inBlip);
    }
  }
}
