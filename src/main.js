import { Game } from "./game/Game.js";

const canvas = document.querySelector("#game-canvas");
const loadingElement = document.querySelector("#loading-screen");
const loadingStatusElement = document.querySelector("#loading-status");
const settingsElement = document.querySelector("#settings-panel");
const promptElement = document.querySelector("#text-prompt");

const game = new Game({
  canvas,
  loadingElement,
  loadingStatusElement,
  settingsElement,
  promptElement
});

game.start().catch((error) => {
  console.error(error);
  loadingStatusElement.textContent = "Game failed to start. Check the console.";
});
