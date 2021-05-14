import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Map from "../components/map";
import Sidebar from "../components/sidebar";
import Legend from '../components/legend';
import Footer from '../components/footer';
import "../css/main.css";

import Routes from "../routes/index";

const Main = class Main extends Component {
  static propTypes = {
    selectedFeature: PropTypes.object,
    sidebarOpen: PropTypes.bool.isRequired,
  };
  render() {
    const mapStyler = {
      zindex: 0,
      width: "100%",
    };
    const screenFlexStyle = {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
    };

    const sidebarState =
      this.props.sidebarOpen && this.props.selectedFeature
        ? "sidebarOpen"
        : "sidebarClosed";

    return (

      <div className={`main ${sidebarState} `} style={mapStyler}>
        <div style={screenFlexStyle}>
          <Sidebar />
          <Map />
        </div>
        {this.props.selectedFeature ? <Legend absolute /> : <></>}
        <Footer inDarkMode/>
        <Routes />
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

export default connect(mapStateToProps)(Main);
