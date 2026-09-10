/**
 * Web Audio API synthesizer for courtroom sound effects.
 * Synthesizes wooden gavel strikes, soundblock resonance, paper rustles, rubber stamps, and gavel dings.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Synthesizes a crisp wooden gavel strike on an oak soundblock.
 * Generates an initial transient noise pop + resonant low wood body thud + high frequency wood click.
 */
export function playGavelStrike(intensity: number = 1.0) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(Math.min(1.0, 0.45 * intensity), now);
  masterGain.connect(ctx.destination);

  // 1. Initial sharp impact transient (wood click)
  const oscClick = ctx.createOscillator();
  const clickGain = ctx.createGain();
  oscClick.type = 'triangle';
  oscClick.frequency.setValueAtTime(680, now);
  oscClick.frequency.exponentialRampToValueAtTime(140, now + 0.04);
  clickGain.gain.setValueAtTime(0.8, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  oscClick.connect(clickGain);
  clickGain.connect(masterGain);
  oscClick.start(now);
  oscClick.stop(now + 0.05);

  // 2. Resonant wood body soundblock vibration
  const oscBody = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  oscBody.type = 'sine';
  oscBody.frequency.setValueAtTime(180, now);
  oscBody.frequency.exponentialRampToValueAtTime(75, now + 0.18);
  bodyGain.gain.setValueAtTime(0.9, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  oscBody.connect(bodyGain);
  bodyGain.connect(masterGain);
  oscBody.start(now);
  oscBody.stop(now + 0.25);

  // 3. Acoustic noise knock burst
  try {
    const bufferSize = ctx.sampleRate * 0.03;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start(now);
  } catch {
    // Fallback if audio buffer fails
  }
}

/**
 * Double strike gavel slam (Order in the court!)
 */
export function playGavelDoubleStrike() {
  playGavelStrike(1.0);
  setTimeout(() => {
    playGavelStrike(1.25);
  }, 140);
}

/**
 * Rubber stamp impact sound for filing rulings (Affirmed, Reversed, Certiorari)
 */
export function playStampSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.4, now);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
  gain.gain.setValueAtTime(1.0, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * Paper flip / file folder rustle sound
 */
export function playPageRustle() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  try {
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(0.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
  } catch {
    // Ignore audio fallback
  }
}

/**
 * Supreme landmark chime when advancing court tiers or unlocking major style chapters
 */
export function playPrecedentFanfare() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, idx) => {
    const now = ctx.currentTime + idx * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  });
}
