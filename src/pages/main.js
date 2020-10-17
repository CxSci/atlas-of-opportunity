import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as Constants from "../constants";
import Map from "../components/map";
import SegregationMap from "../components/segregation";
import Display from "../components/display";
import Legend from "../components/legend";
import Modal from "../components/modal";
import Footer from "../components/footer.js";

const Main = class Main extends Component {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
    mapType: PropTypes.string.isRequired,
  };
  render() {
    const { modal, mapType } = this.props;

    const mapStyler = {
      zindex: 0,
    };

    const footerStyle = {
      zindex: 1,
      position: "absolute",
      bottom: "0px",
      width: "100%",
      pointerEvents: "none",
    };

    const MapToShow = () => {
      console.log("=Maptype:", mapType);
      switch (mapType) {
        case Constants.MAP_TYPE.SEGREGATION:
          return <SegregationMap />;
        case Constants.MAP_TYPE.TRANSCATIONS:
          return <Map />;
        case Constants.MAP_TYPE.GROWTH:
        default:
          return <Map />;
      }
    };

    return (
      <div style={mapStyler}>
        <MapToShow />
        {modal ? (
          <Modal />
        ) : (
          <Fragment>
            <Fragment>
              <Display />
              <Legend />
              <div style={footerStyle}>
                <Footer />
              </div>
            </Fragment>
          </Fragment>
        )}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
    mapType: state.mapType,
  };
}

export default connect(mapStateToProps)(Main);
