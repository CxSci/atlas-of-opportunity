import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setHeaderOption } from "../redux/action-creators";

import "../css/header.css";

const Header = class Header extends Component {
  static propTypes = {
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
 
    return (
      <div class="container" style={headerBox}>
        {/* TODO: make header background color translucent white while in comparison mode */}
        <div class="navbarLeft">
          {/* TODO: put conditional sidebar toggle control here */}
        </div>
        <div class="navbarCenter">
          {/* TODO: put conditional comparison controls here */}
        </div>
        <div class="navbarRight">
          {/* TODO: refactor hamburger menu into its own React component */}
          {/* TODO: make menu's color dark while in comparison mode
                    and when viewing static pages */}
          <div class="dropdown-menu">
            <button class="menu-icon" onClick={this.toggleDropDown}>
              <div class="menu-icon-bar"></div>
              <div class="menu-icon-bar"></div>
              <div class="menu-icon-bar"></div>
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
    path: state.path,
  };
}

export default connect(mapStateToProps)(Header);
