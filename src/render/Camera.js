import { smoothDamp } from "../utils/easing.js";

export class Camera {
  constructor(config) {
    this.config = config;
    this.x = 0;
  }

  update(delta, targetX) {
    this.x = smoothDamp(this.x, targetX, delta * this.config.camera.followSmoothing);
  }
}
