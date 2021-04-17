import React, {  Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Map from "../components/map";
import Sidebar from "../components/sidebar";
import Legend from "../components/legend";

import "../css/main.css";

let Main = class Main extends Component {
  static propTypes = {
    selectedFeature: PropTypes.object,
    sidebarOpen: PropTypes.bool.isRequired,
  };

  render() {
    const mapStyler = {
      zindex: 0,
      width: "100%",
      height: "100%"
    };
    const screenFlexStyle = {
      display: "flex",
      flexDirection: 'row',
      width: "100%",
      height: "100%"
    };

    const sidebarState = (
      this.props.sidebarOpen && this.props.selectedFeature)
        ? 'sidebarOpen' : 'sidebarClosed';

    return (
      <div className={`main ${sidebarState} `} style={mapStyler}>
        <div style={screenFlexStyle}>     
          <Sidebar />
          <Map />
        </div>
        <Legend />
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    selectedFeature: state.selectedFeature,
    sidebarOpen: state.sidebarOpen,
  };
}

Main = connect(mapStateToProps)(Main);

export default Main;
