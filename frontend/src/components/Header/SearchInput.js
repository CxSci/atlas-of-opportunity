import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, InputAdornment, TextField } from '@mui/material'
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'
import { searchListSelector } from '../../store/modules/search'

function SearchInput({ placeholder, onChange = () => null }) {
  const changeTimeoutRef = useRef(0)

  const options = useSelector(searchListSelector)
  console.log(searchListSelector)
  console.log(options)

  const handleChange = e => {
    clearTimeout(changeTimeoutRef.current)

    changeTimeoutRef.current = setTimeout(() => {
      onChange(e)
    }, 500)
  }

  return (
    <Autocomplete
      freeSolo
      id="search-input-autocomplete"
      clearIcon={<CloseIcon />}
      options={options}
      getOptionLabel={item => item?.label}
      renderInput={params => (
        <TextField
          {...params}
          sx={{ width: theme => theme.components.searchInput.width }}
          variant={'filled'}
          onChange={handleChange}
          InputProps={{
            ...params.InputProps,
            placeholder,
            startAdornment: (
              <InputAdornment position="start" sx={{ mt: '0 !important' }}>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  )
}

export default SearchInput
