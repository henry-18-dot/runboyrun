export class RiderAnimationController {
  constructor(stateMachine) {
    this.stateMachine = stateMachine;
    this.cloakPhase = 0;
    this.lastStepDistance = 0;
  }

  update(delta) {
    this.cloakPhase += delta * 4;
  }

  consumeStepEvent() {
    const stepLength = this.stateMachine.speedTier === "fast" ? 34 : this.stateMachine.speedTier === "slow" ? 56 : 44;
    if (this.stateMachine.stepAccumulator - this.lastStepDistance >= stepLength) {
      this.lastStepDistance = this.stateMachine.stepAccumulator;
      return true;
    }
    return false;
  }
}
