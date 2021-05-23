export function formatValue(value, format) {
  let result = null;
  switch (format) {
    case 'number':
      if (value > 100) {
        result = Math.floor(value).toLocaleString('en-US');
      }
      else {
        value = Math.floor(value * 10000) / 10000;
        result = value.toLocaleString('en-US', { minimumFractionDigits: 4 });
      }
      break;
    case 'currency':
      result = value.toLocaleString(undefined, { style: "currency", currency: "AUS" });
      break;
    case 'percent':
      result = `${Math.floor(value)}%`;
      break;
    default:
      result = value;
      break;
  }
  return result;
}
