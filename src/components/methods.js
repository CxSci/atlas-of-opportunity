import React, { Component } from "react";

import { container, content, title } from "../styles/staticPages";

const Methods = class Methods extends Component {
  render() {
    return (
      <div style={container}>
        <div style={content}>
          <h3 style={title}>Methods</h3>
        </div>
      </div>
    );
  }
};

export default Methods;
