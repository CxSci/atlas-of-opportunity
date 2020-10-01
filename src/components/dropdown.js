import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setDropDown } from "../redux/action-creators";

let DropDown = class Display extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    titleSize: PropTypes.string,
    children: PropTypes.array,
    dropdown: PropTypes.string,
  };

  render() {
    const { title, children, titleSize, dropdown } = this.props;

    const container = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0px 15px",
    };
    const titleBox = {
      fontSize: `${titleSize}rem`,
      margin: "0",
      cursor: "default",
    };
    const content = {
      top: "0",
      display: "flex",
      background: "white",
      position: "absolute",
      flexDirection: "column",
      willChange: "transform",
      transform: "translate3d(-10px, 60px, 0px)",
      borderLeft: "#f79640 solid 5px",
    };
    const contentNone = {
      display: "none",
      height: "0",
    };

    return (
      <div
        style={container}
        onMouseEnter={() => setDropDown("on")}
        onMouseLeave={() => setDropDown("off")}
      >
        <h3 style={titleBox}>{title}</h3>
        <ul style={dropdown === "on" ? content : contentNone}>{children}</ul>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    dropdown: state.dropdown,
  };
}

export default connect(mapStateToProps)(DropDown);
