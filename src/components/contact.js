import React, { Component } from "react";

import { container, content, title } from "../styles/staticPages";

const Contact = class Contact extends Component {
  render() {
    return (
      <div style={container}>
        <div style={content}>
          <h3 style={title}>Contact</h3>
        </div>
      </div>
    );
  }
};

export default Contact;
