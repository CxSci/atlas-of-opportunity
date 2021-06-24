export function formatValue(value, format) {
  if (!value) {
    return "n/a";
  }
  switch (format) {
    case 'number':
      return value.toLocaleString();
    case 'currency':
      return value.toLocaleString(undefined, { style: "currency", currency: "AUS" });
    case 'percent':
      return `${Math.floor(value)}%`;
    case 'percent_normalized':
      return `${(value * 100.0).toFixed(2)}%`;
    default:
      return value;
  }
}
