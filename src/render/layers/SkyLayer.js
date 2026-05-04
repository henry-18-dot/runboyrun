import { visualLayersFor } from "../../assets/runtimeVisualManifest.js";
import { renderVisualLayers } from "./LayerImageRenderer.js";

export class SkyLayer {
  render(ctx, viewport, world, cameraX, cache) {
    const imageLayers = visualLayersFor(world.currentBiome.theme.id, "sky");
    if (imageLayers.length > 0) {
      renderVisualLayers(ctx, viewport, cameraX, cache, imageLayers);
      return;
    }

    const { theme } = world.currentBiome;
    const grad = ctx.createLinearGradient(0, 0, 0, viewport.height);
    grad.addColorStop(0, theme.palette.skyTop);
    grad.addColorStop(1, theme.palette.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
  }
}
