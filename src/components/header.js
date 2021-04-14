import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setHeaderOption, setHighlightedFeature, setSelectedFeature } from "../redux/action-creators";
import SearchField from "./search-field";

import "../css/header.css";

const Header = class Header extends Component {
  static propTypes = {
    features: PropTypes.array.isRequired,
    path: PropTypes.string.isRequired,
  };

  state = {
    showDropDown: false,
  };

  toggleDropDown = () => {
    this.setState(prevState => ({ showDropDown: !prevState.showDropDown }));
  };

  render() {
    const { showDropDown } = this.state;

    const headerBox = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      alignContent: "center",
      alignItems: "center",
    };

    const searchFieldProps = {
      localItems: this.props.features.map((f) => {
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
    }

    return (
      <div className="container" style={headerBox}>
        {/* TODO: make header background color translucent white while in comparison mode */}
        <div className="navbarLeft">
          {/* TODO: put conditional sidebar toggle control here */}
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
            <button className="menu-icon" onClick={this.toggleDropDown}>
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
};

function mapStateToProps(state) {
  return {
    features: state.features,
    path: state.path,
  };
}

export default connect(mapStateToProps)(Header);
