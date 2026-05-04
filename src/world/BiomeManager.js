import { THEMES, WEATHER_TYPES, TIME_PRESETS } from "../config/themes.config.js";
import { choose } from "../utils/math.js";

export class BiomeManager {
  constructor(random = Math.random) {
    this.random = random;
    this.current = this.createBiome("grassland");
    this.previousTheme = this.current.theme.id;
  }

  createBiome(preferredThemeId = null) {
    const preferredTheme = preferredThemeId ? THEMES.find((theme) => theme.id === preferredThemeId) : null;
    const themeChoices = THEMES.filter((theme) => theme.id !== this.previousTheme);
    const theme = preferredTheme ?? choose(themeChoices.length ? themeChoices : THEMES, this.random) ?? THEMES[0];
    this.previousTheme = theme.id;
    return {
      theme,
      weather: choose(WEATHER_TYPES, this.random),
      timePreset: choose(TIME_PRESETS, this.random)
    };
  }
}
