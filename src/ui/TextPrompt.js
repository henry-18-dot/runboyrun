export class TextPrompt {
  constructor(element) {
    this.element = element;
    this.timeoutId = null;
  }

  show(message, duration = 2600) {
    this.element.textContent = message;
    this.element.classList.add("is-visible");
    window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.element.classList.remove("is-visible");
    }, duration);
  }
}
