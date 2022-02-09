import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { useCombobox } from "downshift"
import { usePopper } from "react-popper"
import * as turf from "@turf/turf"
import { useDebounce } from 'use-debounce';
import { useSelector } from "react-redux";

import { getSelectedFeature, featuresEqual } from "../redux/getters";
import useGeocoder from "../hooks/useGeocoder"
import { sameWidthModifier } from "../utils/popper-modifiers"
import { ReactComponent as SearchIcon} from "../assets/search-icons/search.svg"
import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

// Forward ref to input element for parents that want to send it events like
// focus() and blur() directly.
const SearchField = forwardRef(({
  localItems = [],
  geocoderConfig = {},
  initialInputValue,
  onFocus,
  onIsOpenChange,
  setHighlightedFeature,
  setSelectedFeature },
  inputRef) => {
  const selectedFeature = useSelector(getSelectedFeature, featuresEqual)
  // Set up popper-js
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    // Set the popper's width to match the search field
    modifiers: useMemo(
      () => [sameWidthModifier], []
    ),
    placement: "bottom-start"
  })

  // Set up downshift-js combobox / autocomplete
  // Default to showing all of the available options
  // const [inputElement, setInputElement] = useState(null)
  const [inputItems, setInputItems] = useState([])
  const [highlightedItem, setHighlightedItem] = useState(null)
  const itemToString = item => (item ? item.primary : '')

  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen,
    openMenu,
    reset,
    selectItem,
    setInputValue,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    initialInputValue,
    items: inputItems,
    itemToString,
    onIsOpenChange: (changes) => {
      // Anything that would close the suggestion menu should cause the input
      // to lose focus too.
      if (!changes.isOpen) {
        inputRef.current.blur()
      }
      onIsOpenChange(changes)
    },
    onInputValueChange: ({ inputValue, type }) => {
      // Clear the selection when the search field is cleared via backspace
      if (inputValue === '' && type === useCombobox.stateChangeTypes.InputChange) {
        // Clear the redux state tracking the selected feature and let this
        // component rerender based on that rather than calling
        // selectItem(null) here
        setSelectedFeature({ selectedItem: null })
      // If inputValue changes while the search menu is closed, it's because 
      // another component changed selectedFeature, and that should be
      // reflected in the selectedItem of the search field.
      } else if (!isOpen && inputValue) {
        const definiteMatch = localItems.find(item => item.primary === inputValue)
        if (definiteMatch) {
          selectItem(definiteMatch)
        }
      }
    },
    onSelectedItemChange: setSelectedFeature,
    onHighlightedIndexChange: ({ highlightedIndex, type }) => {
      switch (type) {
        // Ignore the hidden highlight change which occurs when selecting an
        // item and the menu closes.
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          break
        default:
          setHighlightedItem(inputItems[highlightedIndex])
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const {type, changes} = actionAndChanges
      switch (type) {
        // Don't select whatever happened to be highlighted if the user
        // switches to another window.
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: initialInputValue,
            selectedItem: state.selectedItem,
          }
        default:
          return changes
      }
    },
  })

  // When selectedFeature changes due to another component, make sure the
  // search field reflects that.
  useEffect(() => {
    setInputValue(selectedFeature?.properties.SA2_NAME16 ?? '')
  }, [selectedFeature, setInputValue])

  useEffect(() => {
    if (typeof setHighlightedFeature === "function") {
      setHighlightedFeature({highlightedItem})
    }
  }, [highlightedItem, setHighlightedFeature])

  // Set up geocoder
  const geocodedItems = useGeocoder({
    inputValue,
    // Skip geocoding API call if the results won't even be seen
    enabled: isOpen,
    config: geocoderConfig,
    onNewFeatures: useCallback((features) => (
      // Geocoded results don't include values suitable for .primary, so map
      // them to local features and then drop any which failed to map to
      // anything. Any geocoding result not within a local feature is invalid.
      // For example, a search for "west lak" includes Lake Mundi in Victoria,
      // even though the geocoding request was restricted to South Australia.
      features.map((f) => {
        const localFeature = localItems.find(
          (item) => (item.geometry && turf.booleanPointInPolygon(f.center, item))
        )
        return {
          ...localFeature,
          secondary: f.place_name,
          relevance: f.relevance,
        }
      }).filter(f => f.primary)
    ), [localItems])
  })

  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    const query = debouncedValue.toLowerCase().replace(/\s+/g, ' ').replace(/(^\s+|\s+$)/g, '')
    if (query === '') {
      setInputItems(localItems.sort((a, b) => a.primary.localeCompare(b.primary)))
    } else {
      setInputItems([
        // Case-insensitive substring match
        ...localItems
          .filter(item =>
            item.primary.toLowerCase().indexOf(query.toLowerCase()) !== -1)
          .sort((a, b) => a.primary.localeCompare(b.primary)),
        ...geocodedItems
          .sort((a, b) => b.relevance - a.relevance || a.secondary.localeCompare(b.secondary))
      ])
    }
  }, [localItems, geocodedItems, debouncedValue, isOpen])

  return (
    <div className="searchContainer" ref={setReferenceElement}>
      <div {...getComboboxProps()} className="searchField">
        {/* <label {...getLabelProps()}>Choose an element:</label> */}
        <input {...getInputProps({
          onFocus: () => {
            // Report out the focus event if the parent component cares
            if (onFocus) {
              onFocus()
            }
            // Open the menu if it's not already so
            if (!isOpen) {
              openMenu()
            }
          },
          placeholder: "Search by suburb or region",
          spellCheck: "false",
          ref: inputRef,
          })}
        />
        { inputValue === '' ?
          <button
            tabIndex={-1}
            {...getToggleButtonProps()}
            aria-label="toggle menu"
          >
            <SearchIcon />
          </button>
          :
          <button
            tabIndex={-1}
            onClick={() => {
              setHighlightedItem(null)
              setSelectedFeature({ selectedItem: null })
              reset()
            }}
            aria-label="clear selection"
          >
            <CancelIcon />
          </button>
        }
        <div
          ref={setPopperElement}
          style={{...styles.popper, zIndex: 1}}
          {...attributes.popper}>
          <ul {...getMenuProps({className: "searchMenu"})} hidden={!isOpen}>
            {isOpen &&
              inputItems.map((item, index) => (
                <li className={(highlightedIndex === index
                      ? "highlighted"
                      : "")
                  }
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <div className="primary">{item.primary}</div>
                  <div className="secondary">{item.secondary ?? "SA2 Region"}</div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
})

SearchField.displayName = "SearchField"
SearchField.propTypes = {
  geocoderConfig: PropTypes.object,
  localItems: PropTypes.arrayOf(PropTypes.object),
  initialInputValue: PropTypes.string,
  onFocus: PropTypes.func,
  onIsOpenChange: PropTypes.func,
  setSelectedFeature: PropTypes.func,
  setHighlightedFeature: PropTypes.func,
}

export default SearchField;
