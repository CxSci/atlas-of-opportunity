import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SegregationMap from "../components/segregation";
import Display from "../components/display";
import Legend from "../components/legend";
import Modal from "../components/modal";
import Footer from "../components/footer.js";

const Segregation = class Segregation extends Component {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
  };
  render() {
    const { modal } = this.props;

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

    return (
      <div style={mapStyler}>
        <SegregationMap />
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
  };
}

export default connect(mapStateToProps)(Segregation);
