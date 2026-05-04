export function choose(items, random = Math.random) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  return items[Math.floor(random() * items.length)];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
