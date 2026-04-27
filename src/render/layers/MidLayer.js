export class MidLayer {
  render(ctx, viewport, world, cameraX) {
    ctx.fillStyle = world.currentBiome.theme.palette.mid;
    const baseY = viewport.height * 0.7;
    for (let i = -1; i < 8; i += 1) {
      const x = ((i * 160) - (cameraX * 0.35) % 160);
      ctx.fillRect(x, baseY - (i % 3) * 8, 100, viewport.height - baseY + 20);
    }
  }
}
