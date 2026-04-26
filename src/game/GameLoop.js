export class GameLoop {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this.lastTime = 0;
    this.rafId = null;
  }

  start() {
    if (this.rafId) {
      return;
    }
    const frame = (timeMs) => {
      if (!this.lastTime) {
        this.lastTime = timeMs;
      }
      const deltaSeconds = (timeMs - this.lastTime) / 1000;
      this.lastTime = timeMs;
      this.update(deltaSeconds);
      this.render();
      this.rafId = window.requestAnimationFrame(frame);
    };
    this.rafId = window.requestAnimationFrame(frame);
  }

  stop() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.lastTime = 0;
    }
  }
}
