// Web Audio API synthesizers for local sound effects without external assets

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  // Soft typewriter/keyboard click
  click: (muted: boolean) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  },

  // Soft low buzz for typos
  error: (muted: boolean) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      // Low-pass filter to make it softer and less harsh
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  },

  // Beautiful major pentatonic arpeggio for victory completion
  victory: (muted: boolean) => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Chords: C4, E4, G4, C5, E5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);
        
        // Soft volume envelope
        gain.gain.setValueAtTime(0, now + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 0.6);
      });
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }
};
