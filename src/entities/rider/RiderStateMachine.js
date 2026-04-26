import { CONTROLS_CONFIG } from "../../config/controls.config.js";

export const RiderStates = {
  STOP_IDLE: "stop_idle",
  SLOW_WALK: "slow_walk",
  NORMAL_RUN: "normal_run",
  FAST_START_EXCITED: "fast_start_excited",
  FAST_RUN: "fast_run",
  FAST_TIRED: "fast_tired",
  LONG_STOP_BORED: "long_stop_bored",
  LEFT_RESIST: "left_resist",
  SALUTE: "salute"
};

export class RiderStateMachine {
  constructor({ config, settings }) {
    this.config = config;
    this.settings = settings;
    this.state = RiderStates.NORMAL_RUN;
    this.baseState = RiderStates.NORMAL_RUN;
    this.speedTier = "normal";
    this.fastRunTimer = 0;
    this.fastCooldown = 0;
    this.stopTimer = 0;
    this.leftDistance = 0;
    this.saluteTimer = 0;
    this.positionX = 0;
    this.stepAccumulator = 0;
    this.facing = 1;
  }

  requestSalute() {
    if (this.saluteTimer <= 0 && this.baseState !== RiderStates.LEFT_RESIST) {
      this.saluteTimer = this.config.rider.saluteSeconds;
      this.state = RiderStates.SALUTE;
    }
  }

  update(delta, input) {
    if (this.fastCooldown > 0) this.fastCooldown -= delta;
    if (this.saluteTimer > 0) {
      this.saluteTimer -= delta;
      if (this.saluteTimer <= 0) {
        this.state = this.baseState;
      }
    }

    this.handleSpeedTier(delta, input);
    const speed = this.computeSpeed(delta, input);
    this.positionX += speed * delta;
    this.stepAccumulator += Math.abs(speed) * delta;

    if (speed < 0) {
      this.facing = -1;
      this.leftDistance += Math.abs(speed) * delta;
    } else {
      this.facing = 1;
      this.leftDistance = Math.max(0, this.leftDistance - Math.abs(speed) * delta * 0.65);
    }

    if (this.saluteTimer <= 0) {
      this.state = this.baseState;
    }

    return speed;
  }

  handleSpeedTier(delta, input) {
    if (input.state.rightHeld && input.state.rightHoldSeconds > CONTROLS_CONFIG.accelerateHoldSeconds) {
      if (this.speedTier === "slow") this.speedTier = "normal";
      else if (this.speedTier === "normal" && this.fastCooldown <= 0) {
        this.speedTier = "fast";
        this.fastRunTimer = 0;
        this.baseState = RiderStates.FAST_START_EXCITED;
      }
    }

    if (input.state.leftTapCount >= 2) {
      input.state.leftTapCount = 0;
      if (this.speedTier === "fast") this.speedTier = "normal";
      else if (this.speedTier === "normal") this.speedTier = "slow";
      else if (this.speedTier === "slow") this.speedTier = "stop";
      else if (this.speedTier === "stop") this.speedTier = "left";
    }

    if (this.speedTier === "stop" && input.state.leftHeld && input.state.leftHoldSeconds > CONTROLS_CONFIG.leftHoldSeconds) {
      this.speedTier = "left";
    }

    if (this.speedTier === "stop") {
      this.stopTimer += delta;
      this.baseState = this.stopTimer > this.config.rider.longStopBoredSeconds ? RiderStates.LONG_STOP_BORED : RiderStates.STOP_IDLE;
    } else {
      this.stopTimer = 0;
    }
  }

  computeSpeed(delta) {
    if (this.speedTier === "slow") {
      this.baseState = RiderStates.SLOW_WALK;
      return this.settings.state.slowSpeed;
    }

    if (this.speedTier === "normal") {
      this.baseState = RiderStates.NORMAL_RUN;
      return this.settings.state.normalSpeed;
    }

    if (this.speedTier === "fast") {
      this.fastRunTimer += delta;
      if (this.baseState === RiderStates.FAST_START_EXCITED && this.fastRunTimer > this.config.fastRun.excitedSeconds) {
        this.baseState = RiderStates.FAST_RUN;
      }

      if (!this.settings.state.infiniteFastRun && this.fastRunTimer >= this.settings.state.fastRunDuration) {
        this.speedTier = "fatigue";
        this.fastRunTimer = 0;
        this.baseState = RiderStates.FAST_TIRED;
      }
      return this.settings.state.fastSpeed;
    }

    if (this.speedTier === "fatigue") {
      this.fastRunTimer += delta;
      this.baseState = RiderStates.FAST_TIRED;
      if (this.fastRunTimer > this.config.fastRun.fatigueSlowSeconds) {
        this.speedTier = "normal";
        this.fastCooldown = this.config.fastRun.cooldownSeconds;
      }
      return this.settings.state.slowSpeed;
    }

    if (this.speedTier === "left") {
      if (this.leftDistance >= this.config.rider.leftWalkLimit) {
        this.speedTier = "stop";
        this.baseState = RiderStates.STOP_IDLE;
        return 0;
      }
      this.baseState = RiderStates.LEFT_RESIST;
      return this.config.rider.leftWalkSpeed;
    }

    return 0;
  }
}
