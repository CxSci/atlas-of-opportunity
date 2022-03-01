import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'

export const getStackData = data => {
  const groupedData = groupBy(data, 'z')
  const keys = Object.keys(groupedData).sort()
  return keys.map(key => ({
    title: key,
    data: groupedData[key],
  }))
}

export const getStackChartDomain = data => {
  const groupedData = groupBy(data, 'x')
  const max = Object.keys(groupedData).reduce((max, key) => {
    return Math.max(max, sumBy(groupedData[key], 'y'))
  }, 0)
  const min = Math.min(0, Math.min(...data.map(item => item.y)))
  return [min, max]
}

export const STACK_COLORS = ['#FDD14D', '#27AE60', '#9B51E0', '#FA9246', '#2D9CDB', '#FFE924']
