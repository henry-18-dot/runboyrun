import { MusicManager } from "./MusicManager.js";
import { AmbienceManager } from "./AmbienceManager.js";
import { HoofstepManager } from "./HoofstepManager.js";

export class AudioManager {
  constructor(settings) {
    this.settings = settings;
    this.error = null;
    this.ctx = null;
    this.music = null;
    this.ambience = null;
    this.hoofsteps = null;
  }

  async init() {
    try {
      this.ctx = new window.AudioContext();
      this.music = new MusicManager(this.ctx);
      this.ambience = new AmbienceManager();
      this.hoofsteps = new HoofstepManager(this.ctx);
    } catch (error) {
      this.error = "Audio unavailable, running silently.";
    }
  }

  update(delta, world) {
    if (!this.music || this.settings.state.mute) {
      return;
    }
    this.music.update(this.settings.state.musicVolume * this.settings.state.masterVolume, delta);
    this.ambience.set(world.currentBiome.weather);
  }

  onStep(surface) {
    if (this.settings.state.mute || !this.hoofsteps) {
      return;
    }
    const volume = this.settings.state.masterVolume * this.settings.state.hoofstepVolume;
    this.hoofsteps.trigger(surface, volume);
  }
}
