export class LoadingScreen {
  constructor(element, statusElement) {
    this.element = element;
    this.statusElement = statusElement;
  }

  setStatus(message) {
    this.statusElement.textContent = message;
  }

  hide() {
    this.element.classList.add("is-hidden");
  }
}
