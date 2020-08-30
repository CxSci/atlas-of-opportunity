import React, { Component } from "react";

import { container, content, title } from "../styles/staticPages";

const Research = class Research extends Component {
  render() {
    return (
      <div style={container}>
        <div style={content}>
          <h3 style={title}>Research</h3>
        </div>
      </div>
    );
  }
};

export default Research;
