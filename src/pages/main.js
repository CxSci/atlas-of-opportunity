import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Map from "../components/map";
import Sidebar from "../components/sidebar";
import Legend from '../components/legend';
import Footer from '../components/footer';
import "../css/main.css";

import Routes from "../routes/index";
import { useLocation } from "react-router";

const Main = (props) => {
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
      props.sidebarOpen && props.selectedFeature
        ? "sidebarOpen"
        : "sidebarClosed";

    const [comparisonMode, setComparisonMode] = useState(false);
    const location = useLocation();

    useEffect(() => {
      setComparisonMode(location.pathname.startsWith('/comparison'));
    }, [location]);

    return (

      <div className={`main ${sidebarState} `} style={mapStyler}>
        <div style={screenFlexStyle}>
          <Sidebar />
          {!comparisonMode && <Map />}
        </div>
        {props.selectedFeature && !comparisonMode && <Legend absolute />}
        <Footer inDarkMode/>
        <Routes />
      </div>
    );
  }

Main.propTypes = {
  selectedFeature: PropTypes.object,
  sidebarOpen: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedFeature: state.selectedFeature,
    sidebarOpen: state.sidebarOpen,
  };
}

export default connect(mapStateToProps)(Main);
