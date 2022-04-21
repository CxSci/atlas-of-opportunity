export const getDefaultFilterValues = filters => {
  return filters
    ? filters.reduce((values, filter) => {
        if (filter.default_value) {
          values[filter.key] = filter.default_value
        } else if (filter.values) {
          values[filter.key] = filter.values[0]
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
