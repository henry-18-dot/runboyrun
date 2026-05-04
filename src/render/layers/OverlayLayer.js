import { TIME_STYLES, WEATHER_STYLES } from "../../config/themes.config.js";

export class OverlayLayer {
  render(ctx, viewport, world) {
    const time = TIME_STYLES[world.currentBiome.timePreset];
    const weather = WEATHER_STYLES[world.currentBiome.weather];

    if (time?.light) {
      ctx.fillStyle = time.light;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }

    if (weather?.tint) {
      ctx.fillStyle = weather.tint;
      ctx.fillRect(0, 0, viewport.width, viewport.height);
    }
  }
}
