export const filterData = (data, filters) => {
  if (!filters) {
    return filters
  }
  return data.filter(item => {
    return filters.reduce((filtered, filter) => filter.values.includes(item[filter.key]) || filtered, false)
  })
}

export const COLOR_PALETTES = {
  'Average Spent': 'secondary',
  Count: 'info',
}
