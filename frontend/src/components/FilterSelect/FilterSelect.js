import { useCallback } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import PropTypes from 'prop-types'
import Select from '@mui/material/Select'

import { MetricFilterType } from 'utils/propTypes'
import { getOptions } from './FilterSelect.utils'

const FilterSelect = ({ filter, data, value, onChange }) => {
  const options = getOptions(filter, data)
  const handleChange = useCallback(
    event => {
      onChange(filter.key, event.target.value)
    },
    [onChange, filter?.key],
  )

  return (
    <FormControl variant="standard" sx={{ minWidth: 120 }}>
      <InputLabel>{filter.title}</InputLabel>
      <Select value={value} onChange={handleChange} label={filter.title}>
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

FilterSelect.propTypes = {
  filter: MetricFilterType,
  data: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
}

export default FilterSelect
