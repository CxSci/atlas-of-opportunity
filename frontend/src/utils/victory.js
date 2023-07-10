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

export const getStackData = (data, variant) => {
  const modifiedDataWithDate = data.map(item => {
    if (variant === 'time_years') {
      return { ...item, x: new Date(new Date(item.x).setFullYear(getSettingYear(2022, item.x))) }
    } else if (variant === 'time') {
      return { ...item, x: new Date(item.x) }
    }
    return item
  })
  const groupedData = groupBy(modifiedDataWithDate, 'z')
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

export const getSettingYear = (settingYear, dateString) => {
  const fullYear = new Date(dateString).getFullYear()
  const UTCFullYear = new Date(dateString).getUTCFullYear()
  return settingYear + fullYear - UTCFullYear
}

export const tickValues = [
  new Date('2022-01-01T00:00'),
  new Date('2022-02-01T00:00'),
  new Date('2022-03-01T00:00'),
  new Date('2022-04-01T00:00'),
  new Date('2022-05-01T00:00'),
  new Date('2022-06-01T00:00'),
  new Date('2022-07-01T00:00'),
  new Date('2022-08-01T00:00'),
  new Date('2022-09-01T00:00'),
  new Date('2022-10-01T00:00'),
  new Date('2022-11-01T00:00'),
  new Date('2022-12-01T00:00'),
]
