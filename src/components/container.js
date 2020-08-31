import React, { Component } from "react";
import PropTypes from "prop-types";

const Container = class Container extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string,
  };
  render() {
    const { title, children } = this.props;
    const container = {
      width: "100%",
      height: "100%",
      position: "absolute",
      backgroundColor: "#f9f9f9",
    };
    const content = {
      maxWidth: "750px",
      marginLeft: "200px",
      marginTop: "120px",
    };
    const titleBox = {
      fontSize: "50px",
    };

    return (
      <div style={container}>
        <div style={content}>
          <h3 style={titleBox}>{title}</h3>
          {children}
        </div>
      </div>
    );
  }
};

export default Container;
