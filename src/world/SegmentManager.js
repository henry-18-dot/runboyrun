import { GAME_CONFIG } from "../config/game.config.js";

export class SegmentManager {
  constructor({ tileManager }) {
    this.tileManager = tileManager;
    this.segmentWidth = GAME_CONFIG.world.segmentWidth;
    this.segments = [];
  }

  ensureRange(startX, endX, biome) {
    let cursor = this.segments.length ? this.segments[this.segments.length - 1].endX : 0;
    if (this.segments.length === 0) {
      cursor = Math.floor(startX / this.segmentWidth) * this.segmentWidth;
    }

    while (cursor < endX) {
      const segment = this.createSegment(cursor, biome);
      this.segments.push(segment);
      cursor = segment.endX;
    }

    this.segments = this.segments.filter((segment) => segment.endX > startX - this.segmentWidth * 2);
  }

  createSegment(startX, biome) {
    const width = this.segmentWidth;
    return {
      id: `seg-${startX}`,
      startX,
      endX: startX + width,
      biome,
      tile: this.tileManager.createTile({ x: startX, width, type: biome.groundType })
    };
  }
}
