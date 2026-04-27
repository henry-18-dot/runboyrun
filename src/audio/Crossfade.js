export function crossfadeValues(from, to, progress) {
  return from + (to - from) * Math.min(1, Math.max(0, progress));
}
