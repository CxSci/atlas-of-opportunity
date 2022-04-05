import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'
import { searchListSelector } from '../../store/modules/search'
import debounce from 'lodash/debounce'

function SearchInput({ placeholder, onChange = () => null, onSelect = () => null, onHighlightChange }) {
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState(null)
  const debouncedFuncRef = useRef(null)
  const options = useSelector(searchListSelector)

  const handleChange = e => {
    setInputValue(e?.target?.value)
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

  const handleKeyPress = useCallback(
    e => {
      if (e?.keyCode === 13) {
        if (debouncedFuncRef.current?.cancel) {
          debouncedFuncRef.current.cancel()
        }

        onChange(e?.target?.value)
      }
    },
    [onChange],
  )

  useEffect(() => {
    const debouncedFunc = debounce(() => {
      onChange(inputValue)
    }, 500)
    debouncedFuncRef.current = debouncedFunc

    debouncedFunc()
    return () => {
      debouncedFunc.cancel()
    }
  }, [inputValue, onChange])

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
      value={selected}
      onChange={(event, val) => {
        setSelected(val)
      }}
      onKeyDown={handleKeyPress}
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
