import { TIME_STYLES, WEATHER_STYLES } from "../../config/themes.config.js";

export class SkyLayer {
  render(ctx, viewport, world) {
    const { theme } = world.currentBiome;
    const grad = ctx.createLinearGradient(0, 0, 0, viewport.height);
    grad.addColorStop(0, theme.palette.skyTop);
    grad.addColorStop(1, theme.palette.skyBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    const time = TIME_STYLES[world.currentBiome.timePreset];
    ctx.fillStyle = time.light;
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    ctx.fillStyle = WEATHER_STYLES[world.currentBiome.weather].tint;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
  }
}
