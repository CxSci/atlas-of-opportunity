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
      margin: "0 20px",
      alignItems: "center",
      height: "100%",
      justifyContent: "flex-end",
    };
 
    return (
      <div class="container">
        <div style={headerBox}>
          <div class="navbar-title"> South Australian Opportunities </div>
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
