import { AUDIO_CONFIG } from "../config/audio.config.js";

export class HoofstepManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  trigger(surface, volume) {
    if (!this.audioContext) {
      return;
    }
    const preset = AUDIO_CONFIG.hoofstep[surface] ?? AUDIO_CONFIG.hoofstep.grass;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    oscillator.frequency.value = preset.frequency;
    gain.gain.value = volume * 0.08;
    oscillator.connect(gain).connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + preset.duration);
  }
}
