import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'
import { searchListSelector } from '../../store/modules/search'

function SearchInput({ placeholder, onChange = () => null, onSelect = () => null, onHighlightChange }) {
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState(null)
  const changeTimeoutRef = useRef(0)
  const options = useSelector(searchListSelector)

  const handleChange = e => {
    clearTimeout(changeTimeoutRef.current)
    setInputValue(e?.target?.value)

    changeTimeoutRef.current = setTimeout(() => {
      onChange(e)
    }, 500)
  }

  const handleHighlightChange = useCallback(
    (event, option) => {
      onHighlightChange(option)
    },
    [onHighlightChange],
  )

  useEffect(() => {
    onSelect(selected)
  }, [onSelect, selected])

  return (
    <Autocomplete
      freeSolo
      autoHighlight
      blurOnSelect
      onHighlightChange={handleHighlightChange}
      id="search-input-autocomplete"
      clearIcon={<CloseIcon />}
      options={options || []}
      filterOptions={x => x}
      getOptionLabel={item => item?.title}
      value={selected}
      onChange={(event, val) => {
        setSelected(val)
      }}
      inputValue={inputValue || ''}
      onInputChange={handleChange}
      renderOption={(props, option) => (
        <Stack {...props} key={option?.id + option?.subtitle}>
          <Typography fontWeight={500} sx={{ color: '#000' }}>
            {option?.title}
          </Typography>

          <Typography fontSize={'0.875rem'} sx={{ color: theme => theme.palette.darkGrey.main }}>
            {option?.subtitle}
          </Typography>
        </Stack>
      )}
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
