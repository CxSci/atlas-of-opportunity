import React from 'react'
import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material'
import { KeyboardArrowDown } from '@mui/icons-material'
import PropTypes from 'prop-types'

function Select({ value, onChange, options, label, labelId, hasEmptyOption, menuPlacement = 'top', ...otherProps }) {
  return (
    <FormControl variant="filled" fullWidth {...otherProps}>
      <InputLabel id={labelId} sx={{ color: theme => theme.palette.darkGrey.main }}>
        {label}
      </InputLabel>

      <MuiSelect
        labelId={labelId}
        value={value || ''}
        onChange={onChange}
        disableUnderline
        MenuProps={{
          elevation: 0,
          PaperProps: {
            sx: {
              my: 0,
              boxSizing: 'content-box',
              // borderRadius: menuPlacement === 'top' ? '5px 5px 0 0' : '0 0 5px 5px',
            },
          },
          anchorOrigin: {
            vertical: menuPlacement,
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: menuPlacement === 'top' ? 'bottom' : 'top',
            horizontal: 'center',
          },
        }}
        IconComponent={KeyboardArrowDown}>
        {hasEmptyOption && <MenuItem value={''}> </MenuItem>}

        {(options || []).map(metric => (
          <MenuItem key={metric?.id} value={metric?.id}>
            {metric?.title}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

Select.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  label: PropTypes.string,
  labelId: PropTypes.string,
  hasEmptyOption: PropTypes.bool,
  menuPlacement: PropTypes.oneOf(['top', 'bottom']),
}

export default Select
