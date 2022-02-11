import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import { useSelect } from "downshift"
import { usePopper } from "react-popper"

import { sameWidthModifier } from "../utils/popper-modifiers"

const buttonStyle = {
  border: "1px solid #999",
  borderRadius: "5px",
  padding: "10px 12px",
  fontSize: "14px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}

const buttonOpenStyle = {
  ...buttonStyle,
  borderRadius: "0 0 5px 5px", // flat top
}

const menuStyles = {
  maxHeight: "300",
  overflowY: "auto",
  backgroundColor: "#fff",
  listStyle: "none",
  border: "1px solid #999",
  borderBottom: "none",
  borderRadius: "5px 5px 0 0" // rounded top
}

const itemStyle = {
  padding: "12px"
}

const highlightedItemStyle = {
  backgroundColor: "#F0F0F0"
}

const selectedItemStyle = {
  fontWeight: "bold"
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

function DropdownSelect({ items, selectedItem, handleSelectionChanged }) {
  // Set up popper-js
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    // Set the popper's width to match the button
    modifiers: useMemo(
      () => [sameWidthModifier], []
    ),
    placement: "top-start"
  })

  // Set up downshift-js
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    // Default to the first item in the list
    selectedItem,
    onSelectedItemChange: ({ selectedItem }) => {
      // The height of the select <button /> may change with the selection, so
      // we have the popper lazily recaclulate the dropdown menu's offset each
      // time the selection changes.
      update()
      handleSelectionChanged(selectedItem)
    },
  })

  return (
    <div>
      {/* popper and downshift both want refs to their DOM elements, so wrap
          each downshift element in a div and let popper control those */}
      <div ref={setReferenceElement}>
        <label {...getLabelProps()}></label>
        <button type="button"
          {...getToggleButtonProps()}
          style={isOpen ? buttonOpenStyle : buttonStyle}>
          {selectedItem}
          <ChevronIcon isOpen={isOpen} />
        </button>
      </div>
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        <ul {...getMenuProps()} hidden={!isOpen} style={menuStyles}>
          {isOpen &&
            items.map((item, index) => (
              <li
                style={{
                  ...itemStyle,
                  ...(highlightedIndex === index && highlightedItemStyle),
                  ...(selectedItem === item && selectedItemStyle)
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
  )
}

DropdownSelect.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.string,
  handleSelectionChanged: PropTypes.func.isRequired
}

export default DropdownSelect
