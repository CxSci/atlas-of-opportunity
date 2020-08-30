import React, { Component } from "react";

const About = class About extends Component {
  render() {
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
    const title = {
      fontSize: "50px",
    };
    return (
      <div style={container}>
        <div style={content}>
          <h3 style={title}>About</h3>
        </div>
      </div>
    );
  }
};

export default About;
