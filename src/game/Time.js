import { clamp } from "../utils/math.js";

export class Time {
  constructor() {
    this.delta = 0;
    this.elapsed = 0;
    this.scale = 1;
  }

  step(deltaSeconds) {
    const clamped = clamp(deltaSeconds, 0, 0.05);
    this.delta = clamped * this.scale;
    this.elapsed += this.delta;
  }
}
