import { GAME_CONFIG } from "../config/game.config.js";
import { AUDIO_CONFIG } from "../config/audio.config.js";

const KEY = "run-boy-run-settings";

export class SettingsStore {
  constructor() {
    this.state = {
      masterVolume: AUDIO_CONFIG.defaultVolumes.master,
      musicVolume: AUDIO_CONFIG.defaultVolumes.music,
      ambienceVolume: AUDIO_CONFIG.defaultVolumes.ambience,
      hoofstepVolume: AUDIO_CONFIG.defaultVolumes.hoofsteps,
      mute: false,
      paused: false,
      fullscreen: false,
      slowSpeed: GAME_CONFIG.speeds.slow.default,
      normalSpeed: GAME_CONFIG.speeds.normal.default,
      fastSpeed: GAME_CONFIG.speeds.fast.default,
      fastRunDuration: GAME_CONFIG.fastRun.defaultDurationSeconds,
      infiniteFastRun: false,
      sceneDuration: GAME_CONFIG.scene.defaultDurationSeconds,
      quality: "medium",
      dayNightSpeed: 1,
      weatherEnabled: true,
      integerPixelScaling: false,
      language: "zh",
      focusEntry: true
    };
    this.load();
  }

  load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      this.state = { ...this.state, ...JSON.parse(raw) };
    } catch (error) {
      console.warn("Settings load failed", error);
    }
  }

  save() {
    window.localStorage.setItem(KEY, JSON.stringify(this.state));
  }

  set(partial) {
    this.state = { ...this.state, ...partial };
    this.save();
  }
}
