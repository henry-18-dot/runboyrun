export function smoothDamp(current, target, amount) {
  const t = Math.min(1, Math.max(0, amount));
  return current + (target - current) * t;
}
