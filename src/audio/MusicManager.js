import { crossfadeValues } from "./Crossfade.js";

export class MusicManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.currentVolume = 0;
  }

  update(targetVolume, delta) {
    this.currentVolume = crossfadeValues(this.currentVolume, targetVolume, delta * 0.6);
  }
}
