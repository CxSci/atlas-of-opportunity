import React, { Component } from "react";

import { container, content, title } from "../styles/staticPages";

const Project = class Project extends Component {
  render() {
    return (
      <div style={container}>
        <div style={content}>
          <h3 style={title}>Project</h3>
        </div>
      </div>
    );
  }
};

export default Project;
