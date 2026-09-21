export function formatDecimal(value) {
  return value == null ? '-' : Number(value).toFixed(2);
}
