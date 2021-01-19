import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as Constants from "../constants";
import SegregationMap from "../components/segregation";
import Display from "../components/display";
import Legend from "../components/legend";
import Modal from "../components/modal";

const Segregation = class Segregation extends Component {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
  };
  render() {
    const { modal } = this.props;

    const mapStyler = {
      zindex: 0,
    };
    
    return (
      <div style={mapStyler}>
        <SegregationMap />
        {modal ? (
          <Modal />
        ) : (
          <Fragment>
            <Fragment>
              <Display mapType={Constants.MAP_TYPE.SEGREGATION} />
              <Legend />
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
  };
}

export default connect(mapStateToProps)(Segregation);
