import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material'
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

  const handleInputKeyDown = useCallback(
    e => {
      if ([38, 40].includes(e?.keyCode)) {
        const optionNodesList = document.querySelectorAll('.MuiAutocomplete-popper [data-feature-id]')
        const prevFocusedNode = document.querySelector('.MuiAutocomplete-popper .Mui-focused[data-feature-id]')
        const prevFocusedIndex = +prevFocusedNode?.dataset?.optionIndex

        let nextIndex = prevFocusedIndex + (e?.keyCode === 38 ? -1 : 1)
        if (nextIndex === -1) {
          nextIndex = optionNodesList.length - 1
        } else if (nextIndex === optionNodesList.length) {
          nextIndex = 0
        }

        const nextOptionNode = [...optionNodesList].find(node => +node?.dataset?.optionIndex === nextIndex)
        const nextOption = options?.find(item => item?.id === nextOptionNode?.dataset?.featureId)

        onHighlightChange(nextOption)
      }
    },
    [options, onHighlightChange],
  )

  const handleOptionMouseEnter = useCallback(
    e => {
      const featureId = e?.target?.dataset?.featureId
      const option = options?.find(item => item?.id === featureId)
      onHighlightChange(option)
    },
    [options, onHighlightChange],
  )

  useEffect(() => {
    onSelect(selected)
  }, [onSelect, selected])

  return (
    <Autocomplete
      freeSolo
      autoHighlight
      blurOnSelect
      id="search-input-autocomplete"
      clearIcon={<CloseIcon />}
      options={options || []}
      getOptionLabel={item => item?.title}
      value={selected}
      onChange={(event, val) => {
        setSelected(val)
      }}
      inputValue={inputValue || ''}
      onInputChange={handleChange}
      renderOption={(props, option) => (
        <Box
          {...props}
          data-feature-id={option?.id}
          onMouseEnter={handleOptionMouseEnter}
          sx={{ display: 'block !important' }}>
          <Typography fontWeight={500} sx={{ color: '#000' }}>
            {option?.title}
          </Typography>

          <Typography fontSize={'0.875rem'} sx={{ color: theme => theme.palette.darkGrey.main }}>
            {option?.subtitle}
          </Typography>
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          sx={{ width: theme => theme.components.searchInput.width }}
          variant={'filled'}
          onKeyDown={handleInputKeyDown}
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
