import { GAME_CONFIG } from "../config/game.config.js";
import { Time } from "./Time.js";
import { GameLoop } from "./GameLoop.js";
import { EventBus } from "./EventBus.js";
import { SettingsStore } from "../core/SettingsStore.js";
import { InputManager } from "../core/InputManager.js";
import { AssetLoader } from "../core/AssetLoader.js";
import { PixelScaler } from "../render/PixelScaler.js";
import { Camera } from "../render/Camera.js";
import { CanvasRenderer } from "../render/CanvasRenderer.js";
import { RiderHorse } from "../entities/rider/RiderHorse.js";
import { WorldManager } from "../world/WorldManager.js";
import { AudioManager } from "../audio/AudioManager.js";
import { UiManager } from "../ui/UiManager.js";
import { FocusJourneyManager } from "../focus/FocusJourneyManager.js";

export class Game {
  constructor({ canvas, loadingElement, loadingStatusElement, settingsElement, promptElement }) {
    this.config = GAME_CONFIG;
    this.eventBus = new EventBus();
    this.time = new Time();
    this.settings = new SettingsStore();
    this.input = new InputManager(canvas);
    this.pixelScaler = new PixelScaler(this.settings);
    this.camera = new Camera(this.config);
    this.world = new WorldManager(this.settings);
    this.rider = new RiderHorse({ config: this.config, settings: this.settings });
    this.audio = new AudioManager(this.settings);
    this.ui = new UiManager({
      settingsElement,
      loadingElement,
      loadingStatusElement,
      promptElement,
      settings: this.settings,
      onSettingChanged: () => this.resize()
    });
    this.focus = new FocusJourneyManager();
    this.renderer = new CanvasRenderer({ canvas, game: this });
    this.loop = new GameLoop({
      update: (delta) => this.update(delta),
      render: () => this.renderer.render()
    });
    this.assetLoader = new AssetLoader();
    window.addEventListener("resize", () => this.resize());
  }

  async start() {
    this.ui.loadingScreen.setStatus("Loading manifests...");
    await this.assetLoader.loadAll({
      entries: [
        { key: "themes", url: "/assets/data/themes.json" },
        { key: "audio", url: "/assets/data/audio_manifest.json" },
        { key: "sprite", url: "/assets/data/sprite_manifest.json" }
      ],
      onProgress: (progress) => this.ui.loadingScreen.setStatus(`Loading ${Math.round(progress * 100)}%`)
    });

    await this.audio.init();
    if (this.audio.error) {
      this.ui.prompt.show(this.audio.error, 4200);
    }

    this.resize();
    this.ui.loadingScreen.hide();
    this.loop.start();
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = this.pixelScaler.computeScale(width, height);
    this.renderer.resize(width, height, ratio);
  }

  update(deltaSeconds) {
    this.input.tick(deltaSeconds);
    if (this.input.consumeMenuToggle()) {
      this.ui.toggleSettings();
      this.settings.set({ paused: !this.settings.state.paused });
    }

    const targetScale = this.settings.state.paused ? this.config.pause.drawerTimeScale : this.config.pause.activeTimeScale;
    this.time.scale += (targetScale - this.time.scale) * Math.min(1, deltaSeconds * this.config.pause.smoothing);
    this.time.step(deltaSeconds);

    if (this.input.consumeSalute()) {
      this.rider.stateMachine.requestSalute();
    }

    this.rider.update(this.time.delta, this.input);

    const viewportWidth = this.renderer.canvas.clientWidth;
    const anchor = this.rider.stateMachine.speedTier === "fast" ? this.config.rider.fastScreenAnchor : this.config.rider.screenAnchor;
    const targetX = this.rider.stateMachine.positionX - viewportWidth * anchor;
    this.camera.update(this.time.delta, targetX);

    this.world.update(this.time.delta, this.camera.x, viewportWidth);
    this.audio.update(this.time.delta, this.world);

    if (this.rider.animation.consumeStepEvent()) {
      this.audio.onStep(this.world.currentBiome.theme.groundType);
    }
  }
}
