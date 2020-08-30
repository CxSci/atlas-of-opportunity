import React, { Component } from "react";
import Toggle from "./toggle";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setActiveOption, setHeaderOption } from "../redux/action-creators";

import {
  container,
  headerBox,
  optionsBox,
  options,
  hover,
} from "../styles/header";

const Header = class Header extends Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
  };

  render() {
    const { header } = this.props;

    return (
      <div style={container}>
        <div style={headerBox}>
          <Toggle onChange={setActiveOption} />
          <div style={optionsBox}>
            <h3
              style={header === "map" ? hover : options}
              onClick={() => setHeaderOption("map")}
            >
              Map
            </h3>
            <h3
              style={header === "methods" ? hover : options}
              onClick={() => setHeaderOption("methods")}
            >
              Methods
            </h3>
            <h3
              style={header === "research" ? hover : options}
              onClick={() => setHeaderOption("research")}
            >
              Research
            </h3>
            <h3
              style={header === "project" ? hover : options}
              onClick={() => setHeaderOption("project")}
            >
              Project
            </h3>
            <h3
              style={header === "about" ? hover : options}
              onClick={() => setHeaderOption("about")}
            >
              About
            </h3>
            <h3
              style={header === "contact" ? hover : options}
              onClick={() => setHeaderOption("contact")}
            >
              Contact Us
            </h3>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    header: state.header,
  };
}

export default connect(mapStateToProps)(Header);
