/**
 * Web Audio API synthesizer for 1950s Taiwan Retro Grocery Store & White Terror Theme.
 * High fidelity synthesized sound effects: shop bell, wooden shelf grind, brass lever,
 * cash register ding, 1950s coins clink, police whistle, and atmospheric ambient music.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmGain: GainNode | null = null;
  private bgmOscs: OscillatorNode[] = [];
  private isBgmPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Crate Push Friction Sound (木箱推動摩擦聲)
  playCratePush() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Path Cleared / Route Connected Jingle (動線打通提示音)
  playPathConnect() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  // Vintage Door Entry Bell (叮鈴鈴~)
  playDoorBell() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [659.25, 880, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }

  // Heavy Wooden Shelf Slide along Rail (隆隆木架摩擦聲)
  playShelfSlide() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Filtered noise for wood friction
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(260, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + 0.35);
    filter.Q.value = 3.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.36);

    // Subtle low thud resonance
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(90, now);
    thud.frequency.exponentialRampToValueAtTime(45, now + 0.3);
    thudGain.gain.setValueAtTime(0.25, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.32);
  }

  // Mechanical Cash Register Lever pull & Gear Ratchet (收銀機關桿拉動)
  playLeverPull() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 3 quick ratchet clicks
    [0, 0.05, 0.1].forEach((delay) => {
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(520, now + delay);
      click.frequency.exponentialRampToValueAtTime(120, now + delay + 0.03);

      clickGain.gain.setValueAtTime(0.25, now + delay);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);

      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now + delay);
      click.stop(now + delay + 0.04);
    });

    // Metallic heavy clunk
    const clunk = ctx.createOscillator();
    const clunkGain = ctx.createGain();
    clunk.type = 'triangle';
    clunk.frequency.setValueAtTime(160, now + 0.15);
    clunk.frequency.exponentialRampToValueAtTime(60, now + 0.35);
    clunkGain.gain.setValueAtTime(0.3, now + 0.15);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    clunk.connect(clunkGain);
    clunkGain.connect(ctx.destination);
    clunk.start(now + 0.15);
    clunk.stop(now + 0.4);
  }

  // Cash Register Ring & 1950s Coins Clink (結帳收銀叮聲與銀幣聲)
  playCoinCheckout() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Classic bell ding
    const bell = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1760, now); // A6
    bellGain.gain.setValueAtTime(0.3, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    bell.connect(bellGain);
    bellGain.connect(ctx.destination);
    bell.start(now);
    bell.stop(now + 1.15);

    // Coins falling and clinking
    [0.12, 0.2, 0.28, 0.35].forEach((delay, idx) => {
      const coin = ctx.createOscillator();
      const coinGain = ctx.createGain();
      coin.type = 'triangle';
      coin.frequency.setValueAtTime(2800 + idx * 300, now + delay);
      coin.frequency.exponentialRampToValueAtTime(2200, now + delay + 0.12);

      coinGain.gain.setValueAtTime(0.15, now + delay);
      coinGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);

      coin.connect(coinGain);
      coinGain.connect(ctx.destination);
      coin.start(now + delay);
      coin.stop(now + delay + 0.15);
    });
  }

  // Secret Passage Opens / Stone/Wood trapdoor revealing (密道開啟聲)
  playSecretPassage() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Low mysterious resonance
    const stone = ctx.createOscillator();
    const stoneGain = ctx.createGain();
    stone.type = 'sawtooth';
    stone.frequency.setValueAtTime(80, now);
    stone.frequency.linearRampToValueAtTime(130, now + 0.4);
    stone.frequency.exponentialRampToValueAtTime(50, now + 0.7);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    stoneGain.gain.setValueAtTime(0.01, now);
    stoneGain.gain.linearRampToValueAtTime(0.25, now + 0.2);
    stoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    stone.connect(filter);
    filter.connect(stoneGain);
    stoneGain.connect(ctx.destination);

    stone.start(now);
    stone.stop(now + 0.8);
  }

  // Police Whistle (憲警尖銳哨聲 嗶——！)
  playPoliceWhistle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'triangle';

    // Characteristic whistle dual tone + slight warble
    osc1.frequency.setValueAtTime(2100, now);
    osc2.frequency.setValueAtTime(2250, now);

    // Modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 18; // fast whistle flutter
    lfoGain.gain.value = 40;
    lfo.connect(osc1.frequency);
    lfo.connect(osc2.frequency);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.04);
    gain.gain.setValueAtTime(0.28, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);

    lfo.stop(now + 0.78);
    osc1.stop(now + 0.78);
    osc2.stop(now + 0.78);
  }

  // Danger Heartbeat / Suspicion Surge (警戒急升重擊聲)
  playSuspicionSpike() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  // Dissident Escaped to Safety (避難成功/秘密傳遞完成)
  playSuccessEscape() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.65);
    });
  }

  // Stamp Thud (蓋下印鑑「禁」/ 封條「查封」)
  playStamp() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const thud = ctx.createOscillator();
    const gain = ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(140, now);
    thud.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    thud.connect(gain);
    gain.connect(ctx.destination);
    thud.start(now);
    thud.stop(now + 0.22);
  }

  // Atmospheric Retro Ambient Loop (1950s vinyl crackle + muted dark jazz chords)
  startAtmosphericBgm() {
    if (this.isBgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.08, ctx.currentTime);
    this.bgmGain.connect(ctx.destination);

    // Warm vintage chords progression: Em7 -> Am7 -> B7 -> Em
    const chords = [
      [164.81, 196.00, 246.94], // E3, G3, B3
      [220.00, 261.63, 329.63], // A3, C4, E4
      [246.94, 311.13, 369.99], // B3, D#4, F#4
      [164.81, 196.00, 293.66], // E3, G3, D4
    ];

    let step = 0;
    const playChordStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      const currentNotes = chords[step % chords.length];

      currentNotes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.linearRampToValueAtTime(0.04, t + 0.4);
        noteGain.gain.setValueAtTime(0.035, t + 2.2);
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + 3.2);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain!);

        osc.start(t);
        osc.stop(t + 3.3);
      });

      step++;
      if (this.isBgmPlaying) {
        window.setTimeout(playChordStep, 3200);
      }
    };

    playChordStep();
  }

  stopAtmosphericBgm() {
    this.isBgmPlaying = false;
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
      this.bgmGain = null;
    }
  }

  toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopAtmosphericBgm();
    } else {
      this.startAtmosphericBgm();
    }
    return this.enabled;
  }
}

export const sound = new SoundSystem();
