import { GAME_CONFIG } from "../config/game.config.js";

export class PixelScaler {
  constructor(settings) {
    this.settings = settings;
  }

  computeScale(width, height) {
    if (!this.settings.state.integerPixelScaling) {
      return window.devicePixelRatio || 1;
    }
    const target = GAME_CONFIG.canvas.logicalHeight;
    return Math.max(1, Math.floor(height / target));
  }
}
