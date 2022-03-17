export const getLineChartDomain = data => {
  const max = Math.max(...data.map(item => item.y))
  const min = Math.min(0, Math.min(...data.map(item => item.y)))
  return [min, max]
}

export const formatTickNumber = (value, formatNumber, axis) => {
  if (axis.format === 'number') {
    const { minimumFractionDigits, minimumIntegerDigits, minimumSignificantDigits, ...numberFormat } =
      axis.numberFormat || {}
    return formatNumber(value, {
      notation: 'compact',
      compactDisplay: 'short',
      ...numberFormat,
    })
  }
  return value
}
