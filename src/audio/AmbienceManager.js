export class AmbienceManager {
  constructor() {
    this.current = "clear";
  }

  set(weather) {
    this.current = weather;
  }
}
