import { visualLayersFor } from "../../assets/runtimeVisualManifest.js";
import { renderVisualLayers } from "./LayerImageRenderer.js";

export class MidLayer {
  render(ctx, viewport, world, cameraX, cache) {
    const imageLayers = visualLayersFor(world.currentBiome.theme.id, "mid");
    if (imageLayers.length > 0) {
      renderVisualLayers(ctx, viewport, cameraX, cache, imageLayers);
      return;
    }

    ctx.fillStyle = world.currentBiome.theme.palette.mid;
    const baseY = viewport.height * 0.7;
    for (let i = -1; i < 8; i += 1) {
      const x = ((i * 160) - (cameraX * 0.35) % 160);
      ctx.fillRect(x, baseY - (i % 3) * 8, 100, viewport.height - baseY + 20);
    }
  }
}
