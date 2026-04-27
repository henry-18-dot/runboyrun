import { GAME_CONFIG } from "../config/game.config.js";
import { BiomeManager } from "./BiomeManager.js";
import { SegmentManager } from "./SegmentManager.js";
import { TileManager } from "./TileManager.js";
import { WeatherManager } from "./WeatherManager.js";
import { DayNightManager } from "./DayNightManager.js";
import { LandmarkManager } from "./LandmarkManager.js";

export class WorldManager {
  constructor(settings) {
    this.settings = settings;
    this.biomeManager = new BiomeManager();
    this.weatherManager = new WeatherManager();
    this.dayNightManager = new DayNightManager();
    this.landmarkManager = new LandmarkManager();
    this.segmentManager = new SegmentManager({ tileManager: new TileManager() });
    this.currentBiome = this.biomeManager.current;
    this.transitionTimer = 0;
    this.sceneTimer = 0;
  }

  update(delta, cameraX, viewportWidth) {
    this.sceneTimer += delta;
    const sceneDuration = this.settings.state.sceneDuration;
    if (this.sceneTimer >= sceneDuration) {
      this.sceneTimer = 0;
      this.transitionTimer = 14;
      this.currentBiome = this.biomeManager.createBiome();
      this.weatherManager.set(this.currentBiome.weather);
      this.dayNightManager.set(this.currentBiome.timePreset);
    }

    if (this.transitionTimer > 0) {
      this.transitionTimer = Math.max(0, this.transitionTimer - delta);
    }

    const keepBehind = GAME_CONFIG.world.keepBehindSegments * GAME_CONFIG.world.segmentWidth;
    const keepAhead = GAME_CONFIG.world.keepAheadSegments * GAME_CONFIG.world.segmentWidth;
    this.segmentManager.ensureRange(cameraX - keepBehind, cameraX + viewportWidth + keepAhead, this.currentBiome.theme);
  }
}
