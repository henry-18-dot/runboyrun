import { visualLayersFor } from "../../assets/runtimeVisualManifest.js";
import { renderVisualLayers } from "./LayerImageRenderer.js";

export class AtmosphereLayer {
  render(ctx, viewport, world, cameraX, cache) {
    const imageLayers = visualLayersFor(world.currentBiome.theme.id, "atmosphere");
    if (imageLayers.length > 0) {
      renderVisualLayers(ctx, viewport, cameraX, cache, imageLayers);
      return;
    }

    ctx.fillStyle = "rgba(247, 223, 170, 0.12)";
    ctx.beginPath();
    ctx.arc(viewport.width * 0.72, viewport.height * 0.22, 34, 0, Math.PI * 2);
    ctx.fill();
  }
}
