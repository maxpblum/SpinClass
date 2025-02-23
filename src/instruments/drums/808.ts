// Code in this file is adapted from a ChatGPT response.

/** Create a whitenoise buffer. */
function createWhiteNoise(ctx: AudioContext): AudioBuffer {
	const bufferSize = ctx.sampleRate * 2;
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}
	return buffer;
}

/** Create an 808 kick drum. */
export function makeKick(ctx: AudioContext) {
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'sine';
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start();

	return () => {
		osc.frequency.setValueAtTime(150, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);

		gain.gain.setValueAtTime(1, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

		gain.gain.setValueAtTime(0, ctx.currentTime + 0.5);
	};
}

/** Create an 808 snare drum. */
export function makeSnare(ctx: AudioContext) {
	const noise = ctx.createBufferSource();
	noise.buffer = createWhiteNoise(ctx);
	const noiseFilter = ctx.createBiquadFilter();
	noiseFilter.type = 'highpass';
	noiseFilter.frequency.setValueAtTime(1000, ctx.currentTime);

	const noiseGain = ctx.createGain();

	noise.connect(noiseFilter);
	noiseFilter.connect(noiseGain);
	noiseGain.connect(ctx.destination);

	noise.start();

	const osc = ctx.createOscillator();
	const oscGain = ctx.createGain();
	osc.type = 'sine';
	osc.frequency.setValueAtTime(400, ctx.currentTime);

	osc.connect(oscGain);
	oscGain.connect(ctx.destination);

	osc.start();

	return () => {
		noiseGain.gain.setValueAtTime(1, ctx.currentTime);
		noiseGain.gain.exponentialRampToValueAtTime(0, ctx.currentTime + 0.2);

		oscGain.gain.setValueAtTime(1, ctx.currentTime);
		oscGain.gain.exponentialRampToValueAtTime(0, ctx.currentTime + 0.2);
	};
}

/** Create an 808 hi-hat drum. */
export function makeHiHat(ctx: AudioContext) {
	const noise = ctx.createBufferSource();
	noise.buffer = createWhiteNoise(ctx);

	const filter = ctx.createBiquadFilter();
	filter.type = 'highpass';
	filter.frequency.setValueAtTime(5000, ctx.currentTime);

	const gain = ctx.createGain();

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	noise.start();

	return () => {
		gain.gain.setValueAtTime(0.5, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0, ctx.currentTime + 0.05);
	};
}

/** Create an 808 crash cymbal. */
export function makeCrash(ctx: AudioContext) {
	const noise = ctx.createBufferSource();
	noise.buffer = createWhiteNoise(ctx);

	const filter = ctx.createBiquadFilter();
	filter.type = 'bandpass';
	filter.frequency.setValueAtTime(8000, ctx.currentTime);

	const gain = ctx.createGain();

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	noise.start();

	return () => {
		gain.gain.setValueAtTime(1, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0, ctx.currentTime + 1.5);
	};
}
