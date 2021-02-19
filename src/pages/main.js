import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Map from "../components/map";
import Display from "../components/display";
import Legend from "../components/legend";
import Modal from "../components/modal";

const Main = class Main extends Component {
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
        <Map />
        {modal ? (
          <Modal />
        ) : (
          <Fragment>
            <Fragment>
              <Display />
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

export default connect(mapStateToProps)(Main);
