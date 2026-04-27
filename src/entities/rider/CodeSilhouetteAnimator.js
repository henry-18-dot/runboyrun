export class CodeSilhouetteAnimator {
  render(ctx, rider, x, y) {
    const bob = Math.sin(rider.animation.cloakPhase * 2) * 2;
    const cloak = Math.sin(rider.animation.cloakPhase) * (rider.stateMachine.speedTier === "fast" ? 10 : 4);
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(rider.stateMachine.facing, 1);

    ctx.fillStyle = "#211d1b";
    ctx.fillRect(-28, -18, 56, 16);
    ctx.fillRect(-40, -10, 14, 8);
    ctx.fillRect(26, -10, 14, 8);

    ctx.fillStyle = "#2d2a27";
    ctx.fillRect(-8, -35, 12, 18);
    ctx.beginPath();
    ctx.moveTo(-10, -25);
    ctx.lineTo(-24 - cloak, -18);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.fill();

    if (rider.stateMachine.state === "salute") {
      ctx.fillRect(0, -30, 10, 3);
    }

    ctx.restore();
  }
}
