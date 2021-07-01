import React, { useEffect, useMemo, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useCombobox } from "downshift"
import { usePopper } from "react-popper"
import maxSize from "popper-max-size-modifier";

import { sameWidthModifier } from "../utils/popper-modifiers"
import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

const styles = {
  combo: {
    border: "1px solid #999",
    borderRadius: "5px",
    fontSize: "14px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  comboOpen: {
    borderRadius: "5px 5px 0 0", // flat top
  },
  input: {
    border: "none",
    flexGrow: 1,
    fontFamily: "Roboto", // override annoying font-family setting by Mapbox's assembly.css.
    margin: "0px",
    padding: "5px 0 5px 12px",
    background: "transparent",
  },
  toggle: {
    padding: "8px 12px 6px 0px",
  },
  cancel: {
    padding: "8px 12px 3px 0px",
  },
  menu: {
    maxHeight: "inherit",
    overflowY: "auto",
    backgroundColor: "#fff",
    listStyle: "none",
    border: "1px solid #999",
    borderTop: "none",
    borderRadius: "0 0 5px 5px" // rounded bottom
  },
  item: {
    padding: "12px"
  },
  highlightedItem: {
    backgroundColor: "#F0F0F0"
  },
  selectedItem: {
    fontWeight: "bold"
  },
  popper: {
    overflowY: "auto",
    zIndex: 1,
  }
}


function ChevronIcon({isOpen}) {
  return (
    <svg
      width="15"
      height="9"
      viewBox="0 0 15 9"
      fill="none"
      stroke="#999999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={isOpen ? {transform: "rotateX(180deg)"} : undefined}
    >
      <path d="M1.75 1.125L7.75 7.125L13.75 1.125" />
    </svg>
  )
}

ChevronIcon.propTypes = {
  isOpen: PropTypes.bool
}

const applyMaxSize = {
  name: "applyMaxSize",
  enabled: true,
  phase: "beforeWrite",
  requires: ["maxSize"],
  fn({ state }) {
    const { height } = state.modifiersData.maxSize;
    state.styles.popper.maxHeight = `${height}px`;
  }
}

function TypeaheadSelect({ items, initialSelectedItem, placeholder, handleSelectionChanged }) {
  const inputRef = useRef(null)
  const [inputItems, setInputItems] = useState(items)
  // Set up popper-js
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const {
    styles: popperStyles,
    attributes: popperAttributes
  } = usePopper(referenceElement, popperElement, {
    // Set the popper's width to match the button
    modifiers: useMemo(
      () => [sameWidthModifier, maxSize, applyMaxSize, { name: 'flip', enabled: false }], []
    ),
    placement: "bottom-start"
  })

  // Set up downshift-js

  // Default to the first item in the list if there's no placeholder
  if (!initialSelectedItem && !placeholder) {
    initialSelectedItem = inputItems[0]
  }

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getComboboxProps,
    getInputProps,
    // getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    inputValue,
    openMenu,
    reset,
  } = useCombobox({
    items: inputItems,
    initialSelectedItem,
    onSelectedItemChange: (options) => {
      const selectedItem = options.selectedItem
      handleSelectionChanged(selectedItem)
      inputRef.current.blur()
    },
  })

  useEffect(() => {
      setInputItems(
        items.filter(item =>
          // Allow any single substring match
          item.toLowerCase().indexOf(inputValue.trim().toLowerCase()) !== -1,
        ),
      )
    }, [inputValue, items])

  return (
    <div ref={setReferenceElement}>
      <div {...getComboboxProps()} style={{...styles.combo, ...isOpen ?styles.comboOpen : {}}}>
        {/* <label {...getLabelProps()}>Choose an element:</label> */}
        <input {...getInputProps({
          ref: inputRef,
          onFocus: () => {
            if (!isOpen) {
              openMenu()
            }
          },
          placeholder: placeholder,
          spellCheck: "false",
          })}
          style={styles.input}
        />
        { inputValue === '' ?
          <button
            type="button"
            tabIndex={-1}
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            style={styles.toggle}>
            <ChevronIcon isOpen={isOpen}
          />
          </button>
          :
          <button
            tabIndex={-1}
            onClick={() => {
              reset()
            }}
            aria-label="clear selection"
            style={styles.cancel}
          >
            <CancelIcon />
          </button>
        }
        <div ref={setPopperElement}
          style={{...popperStyles.popper, ...styles.popper}}
          {...popperAttributes.popper}
        >
          <ul {...getMenuProps()} hidden={!isOpen} style={styles.menu}>
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  style={{
                    ...styles.item,
                    ...(highlightedIndex === index && styles.highlightedItem),
                    ...(selectedItem === item && styles.selectedItem)
                  }}

                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

TypeaheadSelect.propTypes = {
  items: PropTypes.array.isRequired,
  initialSelectedItem: PropTypes.string,
  placeholder: PropTypes.string,
  handleSelectionChanged: PropTypes.func.isRequired
}

export default TypeaheadSelect
