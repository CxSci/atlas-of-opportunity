import React from 'react'
import { Autocomplete, InputAdornment, TextField } from '@mui/material'
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'

function SearchInput({ placeholder }) {
  const options = [
    { label: 'The Godfather', id: 1 },
    { label: 'Pulp Fiction', id: 2 },
  ]

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
