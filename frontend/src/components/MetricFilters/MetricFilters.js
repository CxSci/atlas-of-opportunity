import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import { useCallback } from 'react'

import { MetricFilterType } from 'utils/propTypes'
import FilterSelect from 'components/FilterSelect'

const MetricFilters = ({ filters, data, filterValues, onChange }) => {
  const handleChange = useCallback(
    (key, value) => {
      onChange({
        ...filterValues,
        [key]: value,
      })
    },
    [filterValues, onChange],
  )

  return (
    <Box sx={{ mb: 3 }}>
      {filters.map((filter, index) => (
        <Box sx={{ mb: 3 }} key={index}>
          {filter.control === 'select' ? (
            <FilterSelect filter={filter} data={data} value={filterValues[filter.key]} onChange={handleChange} />
          ) : null}
        </Box>
      ))}
    </Box>
  )
}

MetricFilters.propTypes = {
  filters: PropTypes.arrayOf(MetricFilterType),
  data: PropTypes.array.isRequired,
  filterValues: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}

export default MetricFilters
