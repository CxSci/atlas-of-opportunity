export const getDefaultFilterValues = filters => {
  return filters
    ? filters.reduce((values, filter) => {
        if (filter.control === 'select') {
          values[filter.key] = filter.default_value
        }
        return values
      }, {})
    : {}
}

export const filterDataByFilterValues = (data, filterValues) => {
  if (!filterValues || !Object.keys(filterValues).length) {
    return data
  }
  return data.filter(item => {
    for (const key of Object.keys(filterValues)) {
      if (item[key] === filterValues[key]) {
        return true
      }
    }
    return false
  })
}
