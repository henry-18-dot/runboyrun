export class VisualAssetCache {
  constructor() {
    this.images = new Map();
  }

  get(src) {
    if (!src) {
      return null;
    }

    let entry = this.images.get(src);
    if (!entry) {
      const image = new Image();
      entry = { image, loaded: false, failed: false };
      image.addEventListener("load", () => {
        entry.loaded = true;
      });
      image.addEventListener("error", () => {
        entry.failed = true;
      });
      image.src = src;
      this.images.set(src, entry);
    }

    return entry.loaded && !entry.failed ? entry.image : null;
  }
}
