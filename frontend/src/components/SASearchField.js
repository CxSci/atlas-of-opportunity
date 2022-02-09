import React, { useRef, useState, useEffect } from "react"
import { setHighlightedFeature, setSelectedFeature } from "../redux/action-creators"
import { useSelector } from "react-redux";

import { getSelectedFeature, featuresEqual } from "../redux/getters";
import BigTitle from "./BigTitle"
import SearchField from "./SearchField"
import "../css/SearchField.css"

function SASearchField (props) {
  const inputRef = useRef(null)
  const [shouldShowBigTitle, setShouldShowBigTitle] = useState(false)
  const features = useSelector((state) => state.features)
  const selectedFeature = useSelector(getSelectedFeature, featuresEqual)
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
    selectedFeature: selectedFeature,
    setHighlightedFeature: ({ highlightedItem }) => {
      setHighlightedFeature(highlightedItem)
    },
    setSelectedFeature: ({ selectedItem: newFeature }) => {
      if (!!newFeature !== !!selectedFeature
          || newFeature?.properties.SA2_MAIN16 !== selectedFeature?.properties.SA2_MAIN16) {
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
    <div className={`sidebarHeader ${shouldShowBigTitle ? "showBigTitle" : ""}`}>
      <BigTitle 
        onFocus={() => {
          inputRef.current.focus()
        }}
        onCancel={() => {
          setSelectedFeature(null)
        }}
      >
        { selectedFeature?.properties.SA2_NAME16 }
      </BigTitle>
      <SearchField {...searchFieldProps} />
    </div>
  )
}

export default SASearchField
