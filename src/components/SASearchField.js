import React, { useRef, useState, useEffect } from "react"
import PropTypes from "prop-types";
import { setHighlightedFeature, setSelectedFeature } from "../redux/action-creators"
import { connect } from "react-redux";

import SearchField from "./SearchField"
import "../css/SearchField.css"

function SASearchField ({features, selectedFeature, ...props}) {
  const inputRef = useRef(null)
  const [shouldShowBigTitle, setShouldShowBigTitle] = useState(false)
  const searchFieldProps = {
    localItems: features.map((f) => {
      return {
        ...f,
        primary: f.properties.SA2_NAME16,
      }
    }),
    geocoderConfig: {
      countries: ["AU"],
      types: [
        "postcode", "district", "place", "locality"//, "neighborhood", "address"
      ],
      // Restrict search to South Australia
      bbox: [
        129.001337, -38.062603,
        141.002956, -25.996146
      ],
      limit: 5,
    },
    initialInputValue: selectedFeature?.properties.SA2_NAME16 ?? '',
    // A location's name should appear as larger, wrapping text instead of a
    // search field at specific times.
    // Switch to the search field:
    // - By default
    // - On the search field gaining focus
    // - On the search menu opening
    // - On the search menu closing with no existing selection and without
    //   selecting a new item
    // Switch to big text:
    // - On the selection changing via another component, like a map selection
    // - On the search menu closing a location selected
    onFocus: () => {
      setShouldShowBigTitle(false)
    },
    onIsOpenChange: ({ isOpen }) => {
      setShouldShowBigTitle(!isOpen && selectedFeature)
    },
    setHighlightedFeature: ({ highlightedItem }) => {
      setHighlightedFeature(highlightedItem)
    },
    setSelectedFeature: ({ selectedItem: newFeature }) => {
      if (newFeature !== selectedFeature) {
        setSelectedFeature(newFeature)
      }
    },
    // Forward a reference to the input so it can be focused directly from
    // here.
    ref: inputRef,
    ...props
  }

  useEffect(() => {
    setShouldShowBigTitle(!!selectedFeature)
  }, [selectedFeature])

  return (
    <div className={ shouldShowBigTitle ? "showBigTitle" : ""}>
      <div
        className="fancyTitle"
        onClick={() => {
          console.log("Focus the search field", inputRef)
          inputRef.current.focus()
        }}
      >{ selectedFeature?.properties.SA2_NAME16 }</div>
      <SearchField {...searchFieldProps} />
    </div>
  )
}

SASearchField.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
  selectedFeature: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    features: state.features,
    selectedFeature: state.selectedFeature,
  };
}

export default connect(mapStateToProps)(SASearchField)
