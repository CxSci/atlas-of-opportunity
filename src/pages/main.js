import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Map from "../components/map";
import Sidebar from "../components/SideBar";
import Legend from '../components/legend';
import Footer from '../components/footer';
import "../css/main.css";

import Routes from "../routes/index";
import { useLocation } from "react-router";
import TableView from "../components/TableView";

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
      overflow: "hidden",
    };

    const [comparisonMode, setComparisonMode] = useState(false);
    const location = useLocation();

    useEffect(() => {
      setComparisonMode(location.pathname.startsWith('/comparison'));
    }, [location]);

    return (

      <div className="main" style={mapStyler}>
        <div style={screenFlexStyle}>
          <Sidebar />
          {!comparisonMode && <Map />}
          {comparisonMode && <TableView />}
        </div>
        {props.selectedFeature && !comparisonMode && <Legend absolute />}
        <Footer inDarkMode={!comparisonMode}/>
        <Routes />
      </div>
    );
  }

Main.propTypes = {
  selectedFeature: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    selectedFeature: state.selectedFeature,
  };
}

export default connect(mapStateToProps)(Main);
