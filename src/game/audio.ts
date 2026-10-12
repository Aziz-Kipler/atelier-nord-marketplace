/**
 * Supermarket Calf Grand Prix Web Audio Synthesizer
 * Fully self-contained procedural sound effects & background music
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicPlaying: boolean = false;
  private musicTimer: number | null = null;
  private gallopTimer: number | null = null;
  private stepTone: number = 0;

  constructor() {
    // Initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cute calf Moo sound using frequency modulated oscillator
  public playMoo() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.3);
    filter.frequency.exponentialRampToValueAtTime(500, t + 0.8);

    // Pitch sweep: Mooooo (pitch rises slightly then falls smoothly)
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.85);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.1);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.92);
  }

  // Bell ding dong sound
  public playBell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1560, t);
    osc.frequency.exponentialRampToValueAtTime(1420, t + 0.4);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  // Shelf Bump / Shake (thud + metallic spring)
  public playShelfHit(severity: number = 0.5) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Impact thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.2);

    const hitVol = Math.min(0.6, 0.15 + severity * 0.45);
    gain.gain.setValueAtTime(hitVol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);

    // Cans rattling noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'bandpass';
    nFilter.frequency.value = 1800;
    nFilter.Q.value = 3;

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(hitVol * 0.5, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(t);
  }

  // CATASTROPHIC SHELF COLLAPSE (huge crash, groaning metal, cascade of items)
  public playShelfCollapse() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low rumble boom
    const boom = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boom.type = 'sawtooth';
    boom.frequency.setValueAtTime(120, t);
    boom.frequency.exponentialRampToValueAtTime(30, t + 0.8);
    boomGain.gain.setValueAtTime(0.6, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
    boom.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boom.start(t);
    boom.stop(t + 0.9);

    // Metal crash noise burst
    const noiseLen = this.ctx.sampleRate * 0.9;
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      nd[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.45));
    }
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.setValueAtTime(800, t);
    nFilter.frequency.exponentialRampToValueAtTime(300, t + 0.7);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.5, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    noiseSrc.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noiseSrc.start(t);

    // Cascade clatter (succession of quick pings)
    for (let i = 0; i < 5; i++) {
      const pingT = t + 0.1 + i * 0.12;
      const ping = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.value = 600 + Math.random() * 800;
      pGain.gain.setValueAtTime(0.2, pingT);
      pGain.gain.exponentialRampToValueAtTime(0.001, pingT + 0.15);
      ping.connect(pGain);
      pGain.connect(this.ctx.destination);
      ping.start(pingT);
      ping.stop(pingT + 0.16);
    }
  }

  // Item Collected (happy cash register / grocery beep)
  public playPickup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(880, t);
    osc1.frequency.setValueAtTime(1320, t + 0.08);

    osc2.frequency.setValueAtTime(1760, t);
    osc2.frequency.setValueAtTime(2640, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.32);
    osc2.stop(t + 0.32);
  }

  // Boost pad activation
  public playBoost() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.45);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.52);
  }

  // Gallop footstep click
  public playHoofStep(speedRatio: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    this.stepTone = 1 - this.stepTone;
    const baseFreq = this.stepTone === 0 ? 190 : 240;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);

    const vol = Math.min(0.12, 0.03 + speedRatio * 0.08);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.055);
  }

  // Upbeat Supermarket Muzak / Arcade loop
  public startMusic() {
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    this.initCtx();

    const notes = [
      261.63, 329.63, 392.00, 523.25, // C E G C
      293.66, 349.23, 440.00, 587.33, // D F A D
      329.63, 392.00, 493.88, 659.25, // E G B E
      349.23, 440.00, 523.25, 698.46, // F A C F
      392.00, 493.88, 587.33, 783.99, // G B D G
      329.63, 392.00, 493.88, 659.25, // E G B E
      293.66, 349.23, 440.00, 587.33, // D F A D
      246.94, 293.66, 349.23, 493.88  // B D F B
    ];
    let noteIdx = 0;

    this.musicTimer = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      // Synth marimba / grocery mall chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);

      // Bass note on every 4 beats
      if (noteIdx % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.value = freq / 4;
        bassGain.gain.setValueAtTime(0.06, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 0.38);
      }
    }, 180);
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sound = new SoundEngine();
