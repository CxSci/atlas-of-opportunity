import React, { Component } from "react";
import Toggle from "./toggle";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveOption, setHeaderOption } from "../redux/action-creators";
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
    const hover = {
      color: "green",
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
                  onClick={() => setHeaderOption("/")}
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
                <a
                  href="https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=fe948195d5&attid=0.1&permmsgid=msg-f:1678863925469695571&th=174c85d85fd6ce53&view=att&disp=inline&realattid=f_kfj384h21&saddbat=ANGjdJ_QKoL2zT44v2AoIqtMYvQi3xwZ7wfNBw9WaXnb6iVPDa2cGZpwgcgHXnUlaPGizXMim54rYp-4hWpZOeOz3kZX2cQdS1V26ciMh1pFr2mOPtLNd1Gmqg-XuQMRXMG3MQ_sI9IoaUU06k5zwFmLZlr2NyNP2FENAeON-gQxl0fmyRdaLGWGhwtChP8C52TF0j6BeR1SeCDdcziyegS5pWjbMdcGCKZe1pZfTzIinB2WNrkj0sxdiGMPYYA_vU8aJ9m-RYfaJ0WyEFBLxVrToybye87atc7pWTh14WnbHIK3G_67MsiF3-FPIs65BzmRUyyBBQ-8nGYePIEz9D4spoxmIBzxoCPLyMoxBk2DamgGD6Izmnz5gnEe4dztYY1R2SdovGCSvLN0ZLbI1KNMDW4C_IDnxGuFFWW_jRZctzLxh4lS09DY6II_jvtRJQEhPspVoKzZUGxjTn14C16VKeXznyNMUsvEBpgUcpObfAjjZ2tRaua1CsDnafgqDpNf2QkBKuG_9jF9m1ln-vk_Q12dk-WwR552HJz9Ts9jj8Brdkzu_FTvGOn2kTSVtVERJ0usDjdQD2bTeOonFqNivZzqJoA_4VrCNkLqaai1rFDA_IPLdbBP8DB1R17iOEkE5quhPBDaMXMXwFeE8egf7LSkGO9sv96C86OcGyd1jxy_PesEUo3gwbL6ZpQ"
                  style={dropDownLink}
                >
                  Economic Segregation
                </a>
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
