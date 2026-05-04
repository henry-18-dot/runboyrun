import { SkyLayer } from "./layers/SkyLayer.js";
import { AtmosphereLayer } from "./layers/AtmosphereLayer.js";
import { FarLayer } from "./layers/FarLayer.js";
import { MidLayer } from "./layers/MidLayer.js";
import { GroundLayer } from "./layers/GroundLayer.js";
import { ForegroundLayer } from "./layers/ForegroundLayer.js";
import { OverlayLayer } from "./layers/OverlayLayer.js";
import { UiLayer } from "./layers/UiLayer.js";
import { VisualAssetCache } from "./VisualAssetCache.js";

export class CanvasRenderer {
  constructor({ canvas, game }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.game = game;
    this.assetCache = new VisualAssetCache();
    this.backgroundLayers = [new SkyLayer(), new AtmosphereLayer(), new FarLayer(), new MidLayer(), new GroundLayer()];
    this.foregroundLayer = new ForegroundLayer();
    this.overlayLayer = new OverlayLayer();
    this.uiLayer = new UiLayer();
  }

  resize(width, height, ratio) {
    this.canvas.width = Math.floor(width * ratio);
    this.canvas.height = Math.floor(height * ratio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.imageSmoothingEnabled = !this.game.settings.state.integerPixelScaling;
  }

  render() {
    const viewport = { width: this.canvas.clientWidth, height: this.canvas.clientHeight };
    this.ctx.clearRect(0, 0, viewport.width, viewport.height);
    for (const layer of this.backgroundLayers) {
      layer.render(this.ctx, viewport, this.game.world, this.game.camera.x, this.assetCache);
    }

    const riderX = viewport.width * (this.game.rider.stateMachine.speedTier === "fast" ? 0.28 : 0.33);
    const riderY = viewport.height * 0.74 + 18;
    this.game.rider.render(this.ctx, riderX, riderY);
    this.foregroundLayer.render(this.ctx, viewport, this.game.world, this.game.camera.x, this.assetCache);
    this.overlayLayer.render(this.ctx, viewport, this.game.world);
    this.uiLayer.render(this.ctx, viewport, this.game);
  }
}
