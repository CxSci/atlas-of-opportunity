import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import { Autocomplete, CircularProgress, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'
import { searchListSelector } from '../../store/modules/search'
import { isRequestPending } from '../../store/modules/api'

function SearchInput({ placeholder, onChange = () => null, onSelect = () => null, onHighlightChange }) {
  const [inputValue, setInputValue] = useState('')
  const options = useSelector(searchListSelector)
  const isLoading = useSelector(isRequestPending('searchList', 'get'))

  const handleHighlightChange = useCallback(
    (event, option) => {
      onHighlightChange(option)
    },
    [onHighlightChange],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(debounce(onChange, 500), [onChange])

  useEffect(() => {
    debouncedOnChange(inputValue)
  }, [debouncedOnChange, inputValue])

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Autocomplete
      autoHighlight
      blurOnSelect
      onHighlightChange={handleHighlightChange}
      id="search-input-autocomplete"
      clearIcon={<CloseIcon />}
      options={options || []}
      filterOptions={x => x}
      getOptionLabel={item => item?.title || ''}
      value={null}
      onChange={(event, val) => onSelect(val)}
      noOptionsText="No results"
      inputValue={inputValue || ''}
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
          onChange={event => setInputValue(event?.target?.value)}
          InputProps={{
            ...params.InputProps,
            placeholder,
            startAdornment: (
              <InputAdornment position="start" sx={{ mt: '0 !important' }}>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: isLoading ? <CircularProgress color="inherit" size={20} /> : null,
            sx: { paddingRight: '14px !important' },
          }}
        />
      )}
    />
  )
}

export default SearchInput
