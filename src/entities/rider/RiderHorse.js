import { RiderStateMachine } from "./RiderStateMachine.js";
import { RiderAnimationController } from "./RiderAnimationController.js";
import { CodeSilhouetteAnimator } from "./CodeSilhouetteAnimator.js";

export class RiderHorse {
  constructor({ config, settings }) {
    this.stateMachine = new RiderStateMachine({ config, settings });
    this.animation = new RiderAnimationController(this.stateMachine);
    this.animator = new CodeSilhouetteAnimator();
    this.speed = 0;
  }

  update(delta, input) {
    this.speed = this.stateMachine.update(delta, input);
    this.animation.update(delta);
  }

  render(ctx, x, y) {
    this.animator.render(ctx, this, x, y);
  }
}
