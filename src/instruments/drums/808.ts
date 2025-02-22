import { BlipReceiver } from '../../patcher/blip_stream.js';
import { CompletedMetricBeat } from '../../interfaces.js';
import { makeDrumKit } from '../drums/kit.js';

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
function makeKick(ctx: AudioContext) {
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

// 808 Snare Drum
function playSnare() {
	const noise = ctx.createBufferSource();
	noise.buffer = createWhiteNoise();
	const noiseFilter = ctx.createBiquadFilter();
	noiseFilter.type = 'highpass';
	noiseFilter.frequency.setValueAtTime(1000, ctx.currentTime);

	const noiseGain = ctx.createGain();
	noiseGain.gain.setValueAtTime(1, ctx.currentTime);
	noiseGain.gain.exponentialRampToValueAtTime(
		0.001,
		ctx.currentTime + 0.2
	);

	noise.connect(noiseFilter);
	noiseFilter.connect(noiseGain);
	noiseGain.connect(ctx.destination);

	noise.start();
	noise.stop(ctx.currentTime + 0.2);

	const osc = ctx.createOscillator();
	const oscGain = ctx.createGain();
	osc.type = 'sine';
	osc.frequency.setValueAtTime(400, ctx.currentTime);
	oscGain.gain.setValueAtTime(1, ctx.currentTime);
	oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

	osc.connect(oscGain);
	oscGain.connect(ctx.destination);

	osc.start();
	osc.stop(ctx.currentTime + 0.2);
}

// 808 Hi-Hat
function playHiHat() {
	const noise = ctx.createBufferSource();
	noise.buffer = createWhiteNoise();

	const filter = ctx.createBiquadFilter();
	filter.type = 'highpass';
	filter.frequency.setValueAtTime(5000, ctx.currentTime);

	const gain = ctx.createGain();
	gain.gain.setValueAtTime(0.5, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	noise.start();
	noise.stop(ctx.currentTime + 0.05);
}

// 808 Crash Cymbal
function playCrash() {
	const noise = ctx.createBufferSource();
	noise.buffer = createWhiteNoise();

	const filter = ctx.createBiquadFilter();
	filter.type = 'bandpass';
	filter.frequency.setValueAtTime(8000, ctx.currentTime);

	const gain = ctx.createGain();
	gain.gain.setValueAtTime(1, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	noise.start();
	noise.stop(ctx.currentTime + 1.5);
}

class Kit808 {
	private readonly oscNode: OscillatorNode;
	private readonly gainNode: GainNode;

	constructor(private readonly ctx: AudioContext) {
		this.oscNode = this.ctx.createOscillator();
		this.oscNode.type = 'square';
		this.gainNode = this.ctx.createGain();
		this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
		this.oscNode.connect(this.gainNode);
		this.gainNode.connect(this.ctx.destination);
		this.oscNode.start();
	}

	private beep(freq: number) {
		const currentTime = this.ctx.currentTime;
		this.oscNode.frequency.setValueAtTime(freq, currentTime);
		this.gainNode.gain.setValueAtTime(0.5, currentTime);
		this.gainNode.gain.setValueAtTime(0, currentTime + 0.05);
	}

	beepHigh() {
		this.beep(600);
	}

	beepLow() {
		this.beep(200);
	}

	beepMid() {
		this.beep(400);
	}
}

enum Level {
	LOW,
	MID,
	HIGH,
}

function beatToBeep(beat: CompletedMetricBeat): readonly Level[] {
	if (beat.sixteenth === 2 || beat.eighth === 2) {
		// Not a quarter-note beat.
		return [Level.LOW];
	}
	if (beat.quarter === 1) {
		// Downbeat.
		return [Level.HIGH];
	}
	// Non-downbeat quarter-note beat.
	return [Level.MID];
}

/** Blip receiver that emits beeps according to beat position. */
export function makeTempoBeeper(
	ctx: AudioContext
): BlipReceiver<CompletedMetricBeat> {
	const beeper = new Beeper(ctx);
	return makeDrumKit(ctx, beatToBeep, {
		[Level.LOW]: () => () => beeper.beepLow(),
		[Level.MID]: () => () => beeper.beepMid(),
		[Level.HIGH]: () => () => beeper.beepHigh(),
	});
}
