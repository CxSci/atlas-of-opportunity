import React, { Component } from "react";
import Toggle from "./toggle";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  setActiveOption,
  setHeaderOption,
  setMapType,
} from "../redux/action-creators";
import DropDown from "./dropdown";

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
      zIndex: 3, // 2 for detail pane, 1 for footer logos
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
    const clicked = {
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
    const dropDownOption = {
      padding: "10px 20px 10px 15px",
      fontSize: "18px",
    };
    const dropDownLink = {
      cursor: "pointer",
      color: "black",
    };

    return (
      <div style={container}>
        <div style={headerBox}>
          <Toggle onChange={setActiveOption} />
          <div style={optionsBox}>
            <DropDown title="Map" titleSize="1.3">
              <li style={dropDownOption}>
                <Link
                  to="/"
                  style={dropDownLink}
                  onClick={() => {
                    setHeaderOption("/");
                    setMapType("growth");
                  }}
                >
                  Mobility Map
                </Link>
              </li>
              <li style={dropDownOption}>
                <Link
                  to="/"
                  style={dropDownLink}
                  onClick={() => setHeaderOption("/")}
                >
                  Financial Interactions
                </Link>
              </li>
              <li style={dropDownOption}>
                <Link
                  to="/"
                  style={dropDownLink}
                  onClick={() => setMapType("segregation")}
                >
                  Economic Segregation
                </Link>
              </li>
            </DropDown>

            <Link
              to="/methods"
              style={path === "/methods" ? clicked : options}
              onClick={() => setHeaderOption("/methods")}
            >
              Methods
            </Link>
            <Link
              to="/research"
              style={path === "/research" ? clicked : options}
              onClick={() => setHeaderOption("/research")}
            >
              Research
            </Link>
            <Link
              to="/about"
              style={path === "/about" ? clicked : options}
              onClick={() => setHeaderOption("/about")}
            >
              About
            </Link>
            <Link
              to="/faq"
              style={path === "/faq" ? clicked : options}
              onClick={() => setHeaderOption("/faq")}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              style={path === "/contact" ? clicked : options}
              onClick={() => setHeaderOption("/contact")}
            >
              Contact
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
