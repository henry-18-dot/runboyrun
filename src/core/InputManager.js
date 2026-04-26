import { CONTROLS_CONFIG } from "../config/controls.config.js";

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = {
      rightHeld: false,
      leftHeld: false,
      rightHoldSeconds: 0,
      leftHoldSeconds: 0,
      leftTapCount: 0,
      leftTapTimer: 0,
      saluteRequested: false,
      toggleMenuRequested: false
    };
    this.bindings();
  }

  bindings() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "ArrowRight") this.state.rightHeld = true;
      if (event.code === "ArrowLeft") this.state.leftHeld = true;
      if (event.code === "Escape" || event.code === "Tab") {
        event.preventDefault();
        this.state.toggleMenuRequested = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "ArrowRight") this.state.rightHeld = false;
      if (event.code === "ArrowLeft") {
        if (this.state.leftHoldSeconds < CONTROLS_CONFIG.leftHoldSeconds) {
          this.state.leftTapCount += 1;
          this.state.leftTapTimer = CONTROLS_CONFIG.leftTapWindowSeconds;
        }
        this.state.leftHeld = false;
        this.state.leftHoldSeconds = 0;
      }
    });

    this.canvas.addEventListener("click", () => {
      this.state.saluteRequested = true;
    });
  }

  tick(delta) {
    if (this.state.rightHeld) this.state.rightHoldSeconds += delta;
    else this.state.rightHoldSeconds = 0;

    if (this.state.leftHeld) this.state.leftHoldSeconds += delta;
    if (this.state.leftTapTimer > 0) {
      this.state.leftTapTimer -= delta;
    } else {
      this.state.leftTapCount = 0;
    }
  }

  consumeMenuToggle() {
    const value = this.state.toggleMenuRequested;
    this.state.toggleMenuRequested = false;
    return value;
  }

  consumeSalute() {
    const value = this.state.saluteRequested;
    this.state.saluteRequested = false;
    return value;
  }
}
