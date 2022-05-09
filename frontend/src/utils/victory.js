import groupBy from 'lodash/groupBy'

export const getLineChartDomain = data => {
  const max = Math.max(...data.map(item => item.y))
  const min = Math.min(0, Math.min(...data.map(item => item.y)))
  return [min, max]
}

export const formatTickNumber = (value, axis, intl) => {
  const { formatNumber, formatDate } = intl
  if (axis.format === 'number') {
    const { minimumFractionDigits, minimumIntegerDigits, minimumSignificantDigits, ...numberFormat } =
      axis.numberFormat || {}
    return formatNumber(value, {
      notation: 'compact',
      compactDisplay: 'short',
      ...numberFormat,
    })
  } else if (axis.format === 'date') {
    return formatDate(value, {
      ...axis.dateFormat,
    })
  }
  return value
}

export const getStackData = data => {
  const groupedData = groupBy(data, 'z')
  const keys = Object.keys(groupedData).sort()
  return keys.map(key => ({
    title: key,
    data: groupedData[key],
  }))
}

export const STACK_COLORS = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab',
]

export const angledProperty = {
  tickLabels: { angle: 45 },
}
