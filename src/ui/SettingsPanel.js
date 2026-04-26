const LABELS = {
  zh: {
    title: "旅途设置",
    close: "×",
    audio: "声音",
    gameplay: "旅途",
    visual: "画面",
    other: "其他"
  },
  en: {
    title: "Journey Settings",
    close: "×",
    audio: "Audio",
    gameplay: "Travel",
    visual: "Visual",
    other: "Other"
  }
};

export class SettingsPanel {
  constructor(element, settings, onChange) {
    this.element = element;
    this.settings = settings;
    this.onChange = onChange;
    this.open = false;
    this.render();
  }

  toggle() {
    this.open = !this.open;
    this.element.classList.toggle("is-open", this.open);
  }

  render() {
    const lang = this.settings.state.language;
    const labels = LABELS[lang];
    this.element.innerHTML = `
      <div class="panel-header">
        <h2 class="panel-title">${labels.title}</h2>
        <button class="icon-button" data-action="close">${labels.close}</button>
      </div>
      ${this.section(labels.audio, [
        this.range("masterVolume", "Master", 0, 1, 0.01),
        this.range("musicVolume", "Music", 0, 1, 0.01),
        this.range("ambienceVolume", "Ambience", 0, 1, 0.01),
        this.range("hoofstepVolume", "Hoof", 0, 1, 0.01),
        this.checkbox("mute", "Mute")
      ])}
      ${this.section(labels.gameplay, [
        this.range("slowSpeed", "Slow", 24, 96, 1),
        this.range("normalSpeed", "Run", 72, 170, 1),
        this.range("fastSpeed", "Fast", 140, 300, 1),
        this.range("fastRunDuration", "Fast Sec", 5, 60, 1),
        this.checkbox("infiniteFastRun", "∞ Fast"),
        this.range("sceneDuration", "Scene Sec", 60, 600, 5)
      ])}
      ${this.section(labels.visual, [
        this.select("quality", "Quality", ["low", "medium", "high"]),
        this.range("dayNightSpeed", "Day/Night", 0.2, 4, 0.1),
        this.checkbox("weatherEnabled", "Weather"),
        this.checkbox("integerPixelScaling", "Pixel Perfect")
      ])}
      ${this.section(labels.other, [
        this.select("language", "Lang", ["zh", "en"]),
        this.checkbox("focusEntry", "Focus Journey")
      ])}
    `;

    this.bind();
  }

  section(title, rows) {
    return `<section class="settings-section"><h3>${title}</h3>${rows.join("")}</section>`;
  }

  range(key, label, min, max, step) {
    const value = this.settings.state[key];
    return `<div class="setting-row"><label>${label}</label><input data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"/></div>`;
  }

  checkbox(key, label) {
    const checked = this.settings.state[key] ? "checked" : "";
    return `<div class="setting-row"><label>${label}</label><input data-key="${key}" type="checkbox" ${checked}/></div>`;
  }

  select(key, label, options) {
    const opts = options
      .map((option) => `<option value="${option}" ${option === this.settings.state[key] ? "selected" : ""}>${option}</option>`)
      .join("");
    return `<div class="setting-row"><label>${label}</label><select data-key="${key}">${opts}</select></div>`;
  }

  bind() {
    this.element.querySelector("[data-action='close']")?.addEventListener("click", () => this.toggle());
    this.element.querySelectorAll("[data-key]").forEach((control) => {
      control.addEventListener("input", () => {
        const key = control.dataset.key;
        const value = control.type === "checkbox" ? control.checked : control.type === "range" ? Number(control.value) : control.value;
        this.settings.set({ [key]: value });
        if (key === "language") {
          this.render();
          return;
        }
        this.onChange?.(key, value);
      });
    });
  }
}
