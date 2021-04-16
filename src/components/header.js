import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setHeaderOption, setHighlightedFeature, setSelectedFeature } from "../redux/action-creators";
import SearchField from "./search-field";

import "../css/header.css";

function Header ({ features, selectedFeature }) {
  const [showDropDown, setShowDropDown] = useState(false)
  const toggleDropDown = useCallback(() => setShowDropDown(state => !state), []);

  const headerBox = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  };

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
    selectedFeature: selectedFeature,
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedFeature(selectedItem)
    },
    onHighlightedItemChange: ({ highlightedItem }) => {
      setHighlightedFeature(highlightedItem)
    },
  }

  return (
    <div className="container" style={headerBox}>
      {/* TODO: make header background color translucent white while in comparison mode */}
      <div className="navbarLeft">
        <SearchField {...searchFieldProps} />
      </div>
      <div className="navbarCenter">
        {/* TODO: put conditional comparison controls here */}
      </div>
      <div className="navbarRight">
        {/* TODO: refactor hamburger menu into its own React component */}
        {/* TODO: make menu's color dark while in comparison mode
                  and when viewing static pages */}
        {/* TODO: convert to use a similar downshift/popper setup as
                  the dropdownSelect */}
        <div className="dropdown-menu">
          <button className="menu-icon" onClick={toggleDropDown}>
            <div className="menu-icon-bar"></div>
            <div className="menu-icon-bar"></div>
            <div className="menu-icon-bar"></div>
          </button>
          <div className={`dropdown-content ${showDropDown ? "show" : ""}`}>
            <Link
              to="/"
              onClick={() => setHeaderOption("/")}
            >
              Map
            </Link>
            <Link
              to="/methods"
              onClick={() => setHeaderOption("/methods")}
            >
              Methods
            </Link>
            <Link
              to="/research"
              onClick={() => setHeaderOption("/research")}
            >
              Research
            </Link>
            <Link
              to="/about"
              onClick={() => setHeaderOption("/about")}
            >
              About
            </Link>
            <Link
              to="/faq"
              onClick={() => setHeaderOption("/faq")}
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
    features: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
    selectedFeature: PropTypes.object
};

function mapStateToProps(state) {
  return {
    features: state.features,
    path: state.path,
    selectedFeature: state.selectedFeature,
  };
}

export default connect(mapStateToProps)(Header);
