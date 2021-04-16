import React from "react"
import PropTypes from "prop-types";
import { setHighlightedFeature, setSelectedFeature } from "../redux/action-creators"
import { connect } from "react-redux";

import SearchField from "./SearchField"

// features comes directy from redux
// all other props come from the parent component
function SASearchField ({features, ...props}) {
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
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedFeature(selectedItem)
    },
    onHighlightedItemChange: ({ highlightedItem }) => {
      setHighlightedFeature(highlightedItem)
    },
    ...props
  }

  return (
    <SearchField {...searchFieldProps} />
  )
}

SASearchField.propTypes = {
  features: PropTypes.arrayOf(PropTypes.object),
}

function mapStateToProps(state) {
  return {
    features: state.features,
  };
}

export default connect(mapStateToProps)(SASearchField)
