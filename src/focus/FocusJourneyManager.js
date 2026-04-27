import { FOCUS_CONFIG } from "../config/focus.config.js";
import { Commission } from "./Commission.js";

export class FocusJourneyManager {
  constructor() {
    this.enabled = FOCUS_CONFIG.enabled;
    this.commission = new Commission(FOCUS_CONFIG.commissionText);
  }
}
