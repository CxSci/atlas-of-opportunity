const formatValue = (value, format) => {
  if (!value) {
    return "n/a";
  }
  switch (format) {
    case 'number':
      return value.toLocaleString();
    case 'currency':
      return value.toLocaleString(undefined, { style: "currency", currency: "AUD" });
    case 'percent':
      return `${Math.floor(value)}%`;
    case 'percent_normalized':
      return `${(value * 100.0).toFixed(2)}%`;
    default:
      return value ? value + '' : '';
  }
}

const formatLabel = (metric, codes) => {
  if (!metric.labelFormat) {
    return metric.label
  }
  switch (metric.labelFormat) {
    case "anzsic": {
      // Expects label to be one of the ANZSIC code types
      const code = codes.find(c => c.class_code === metric.label ||
        c.group_code === metric.label ||
        c.subdivision_code === metric.label ||
        c.division_code === metric.label
      )
      // Give up if the ANZSIC code is invalid
      if (!code) {
        break
      }
      // The formatted label then varies depending on how specific the code
      // was:
      // e.g. A    -> "Agriculture, Forestry and Fishing"
      //      01   -> "Agriculture"
      //      011  -> "Nursery and Floriculture Production"
      //      0113 -> "Turf Growing"
      if (code.division_code === metric.label) {
        return code.division_title
      } else if (code.subdivision_code === metric.label) {
        return code.subdivision_title
      } else if (code.group_code === metric.label) {
        return code.group_title
      } else if (code.class_code === metric.label) {
        return code.class_title
      }
      break
    }
    default:
      break
  }
  return metric.label
}

export { formatLabel, formatValue }