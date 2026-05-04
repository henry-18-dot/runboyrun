import { visualLayersFor } from "../../assets/runtimeVisualManifest.js";
import { renderVisualLayers } from "./LayerImageRenderer.js";

export class ForegroundLayer {
  render(ctx, viewport, world, cameraX, cache) {
    const imageLayers = visualLayersFor(world.currentBiome.theme.id, "foreground");
    if (imageLayers.length > 0) {
      renderVisualLayers(ctx, viewport, cameraX, cache, imageLayers);
      return;
    }

    ctx.fillStyle = world.currentBiome.theme.palette.foreground;
    for (let i = -1; i < 12; i += 1) {
      const x = (i * 90) - (cameraX * 0.9) % 90;
      const y = viewport.height * 0.74;
      ctx.fillRect(x, y - 14, 4, 14);
    }
  }
}
