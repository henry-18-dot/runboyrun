import { visualLayersFor } from "../../assets/runtimeVisualManifest.js";
import { renderVisualLayers } from "./LayerImageRenderer.js";

export class GroundLayer {
  render(ctx, viewport, world, cameraX, cache) {
    const imageLayers = visualLayersFor(world.currentBiome.theme.id, ["ground_back", "ground"]);
    if (imageLayers.length > 0) {
      renderVisualLayers(ctx, viewport, cameraX, cache, imageLayers);
      return;
    }

    const theme = world.currentBiome.theme;
    const groundY = viewport.height * 0.74;
    ctx.fillStyle = theme.palette.ground;
    ctx.fillRect(0, groundY, viewport.width, viewport.height - groundY);

    ctx.fillStyle = theme.palette.road;
    ctx.fillRect(0, groundY + 18, viewport.width, 24);

    ctx.fillStyle = "rgba(0,0,0,0.08)";
    world.segmentManager.segments.forEach((segment) => {
      const sx = segment.startX - cameraX;
      ctx.fillRect(sx, groundY + 18, 2, 24);
    });
  }
}
