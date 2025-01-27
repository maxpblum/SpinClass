export class BlipSink<Blip> {
  constructor(private readonly handler: (Blip) => void) {}
  async listen(blips: AsyncIterable<Blip>) {
    for await (const blip of blips) {
      this.handler(blip);
    }
  }
}
