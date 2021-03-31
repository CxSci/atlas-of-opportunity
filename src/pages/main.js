import React, { Fragment, Component } from "react";
import { connect } from "react-redux";

import Map from "../components/map";
import Display from "../components/display";
import Legend from "../components/legend";

const Main = class Main extends Component {
  render() {
    const mapStyler = {
      zindex: 0,
    };

    return (
      <div style={mapStyler}>
        <Map />
        <Fragment>
          <Fragment>
            <Display />
            <Legend />
          </Fragment>
        </Fragment>
      </div>
    );
  }
};

export default connect()(Main);
