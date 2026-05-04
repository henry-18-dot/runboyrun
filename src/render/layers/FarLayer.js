import { visualLayersFor } from "../../assets/runtimeVisualManifest.js";
import { renderVisualLayers } from "./LayerImageRenderer.js";

export class FarLayer {
  render(ctx, viewport, world, cameraX, cache) {
    const imageLayers = visualLayersFor(world.currentBiome.theme.id, ["far", "far_detail"]);
    if (imageLayers.length > 0) {
      renderVisualLayers(ctx, viewport, cameraX, cache, imageLayers);
      return;
    }

    const color = world.currentBiome.theme.palette.far;
    ctx.fillStyle = color;
    const baseY = viewport.height * 0.6;
    for (let i = -1; i < 6; i += 1) {
      const x = ((i * 220) - (cameraX * 0.2) % 220);
      ctx.beginPath();
      ctx.moveTo(x, viewport.height);
      ctx.lineTo(x + 110, baseY - (i % 2) * 20);
      ctx.lineTo(x + 220, viewport.height);
      ctx.closePath();
      ctx.fill();
    }
  }
}
