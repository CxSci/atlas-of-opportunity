import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setHeaderOption } from "../redux/action-creators";

import "../css/header.css";

function Header () {
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

  return (
    <div className="container" style={headerBox}>
      {/* TODO: make header background color translucent white while in comparison mode */}
      <div className="navbarLeft">
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
    path: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    path: state.path,
  };
}

export default connect(mapStateToProps)(Header);
