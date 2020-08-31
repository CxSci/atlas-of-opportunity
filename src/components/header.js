import React, { Component } from "react";
import Toggle from "./toggle";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveOption, setHeaderOption } from "../redux/action-creators";

const Header = class Header extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
  };

  render() {
    const { path } = this.props;

    const container = {
      width: "100%",
      height: "60px",
      background: "white",
      position: "fixed",
      zIndex: 1,
      top: 0,
    };
    const headerBox = {
      display: "flex",
      margin: "0 20px",
      alignItems: "center",
      height: "100%",
      justifyContent: "space-between",
    };
    const optionsBox = {
      display: "flex",
      height: "100%",
      flexDirection: "row",
    };
    const options = {
      display: "flex",
      alignItems: "center",
      margin: 0,
      padding: "0 15px",
      color: "black",
      fontSize: "1.3rem",
      fontWeight: "bold",
      cursor: "pointer",
      height: "100%",
    };
    const hover = {
      display: "flex",
      alignItems: "center",
      fontSize: "1.3rem",
      fontWeight: "bold",
      margin: 0,
      padding: "0 15px",
      cursor: "pointer",
      height: "100%",
      color: "#f79640",
      borderBottom: "#f79640 solid 5px",
    };

    return (
      <div style={container}>
        <div style={headerBox}>
          <Toggle onChange={setActiveOption} />
          <div style={optionsBox}>
            <Link
              to="/"
              style={path === "/" ? hover : options}
              onClick={() => setHeaderOption("/")}
            >
              Map
            </Link>
            <Link
              to="/methods"
              style={path === "/methods" ? hover : options}
              onClick={() => setHeaderOption("/methods")}
            >
              Methods
            </Link>
            <Link
              to="/research"
              style={path === "/research" ? hover : options}
              onClick={() => setHeaderOption("/research")}
            >
              Research
            </Link>
            <Link
              to="/project"
              style={path === "/project" ? hover : options}
              onClick={() => setHeaderOption("/project")}
            >
              Project
            </Link>
            <Link
              to="/about"
              style={path === "/about" ? hover : options}
              onClick={() => setHeaderOption("/about")}
            >
              About
            </Link>
            <Link
              to="/contact"
              style={path === "/contact" ? hover : options}
              onClick={() => setHeaderOption("/contact")}
            >
              Contact Us
            </Link>
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
