import React, {  Component } from "react";
import { connect } from "react-redux";

import Map from "../components/map";
import Display from "../components/display";
import Legend from "../components/legend";

const Main = class Main extends Component {
  render() {
    const mapStyler = {
      zindex: 0,
    };
    const screenFlexStyle = {
      display: "flex",
      flexDirection: 'row',
    };

    return (
      <div style={mapStyler}>
        <div style={screenFlexStyle}>
          <Map />
          <Display />
        </div>
        <Legend />
      </div>
    );
  }
};

export default connect()(Main);
