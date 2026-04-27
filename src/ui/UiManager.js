import { SettingsPanel } from "./SettingsPanel.js";
import { LoadingScreen } from "./LoadingScreen.js";
import { TextPrompt } from "./TextPrompt.js";

export class UiManager {
  constructor({ settingsElement, loadingElement, loadingStatusElement, promptElement, settings, onSettingChanged }) {
    this.settingsPanel = new SettingsPanel(settingsElement, settings, onSettingChanged);
    this.loadingScreen = new LoadingScreen(loadingElement, loadingStatusElement);
    this.prompt = new TextPrompt(promptElement);
  }

  toggleSettings() {
    this.settingsPanel.toggle();
  }
}
