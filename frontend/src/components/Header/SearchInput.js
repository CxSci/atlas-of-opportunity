import React from 'react'
import { FormControl, Input, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

function SearchInput({ placeholder }) {
  return (
    <FormControl variant="filled">
      <Input
        placeholder={placeholder}
        // TODO: if border has to be removed
        // sx={{ ':before': { content: 'none' }, ':after': { content: 'none' } }}
        sx={{ width: theme => theme.components.searchInput.width }}
        startAdornment={
          <InputAdornment position="start" sx={{ mt: '0 !important' }}>
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default SearchInput
