export class UiLayer {
  render(ctx, viewport, game) {
    ctx.save();
    ctx.fillStyle = "rgba(17,24,35,0.25)";
    ctx.fillRect(12, 12, 210, 74);
    ctx.fillStyle = "#f6eddc";
    ctx.font = "12px sans-serif";
    ctx.fillText(`Theme: ${game.world.currentBiome.theme.label}`, 20, 32);
    ctx.fillText(`Weather: ${game.world.currentBiome.weather}`, 20, 50);
    ctx.fillText(`State: ${game.rider.stateMachine.state}`, 20, 68);
    ctx.restore();
  }
}
