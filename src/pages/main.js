import React, { Fragment, Component } from "react";
//import PropTypes from "prop-types";
//import { connect } from "react-redux";

import Map from "../components/map";
import Display from "../components/display";
import Legend from "../components/legend";
//import Modal from "../components/modal";
import Footer from "../components/footer.js";

const Main = class Main extends Component {
  /*static propTypes = {
    modal: PropTypes.string.isRequired,
  };*/
  render() {
    //const { modal } = this.props;

    const mapStyler = {
      zindex: 0,
    };

    const footerStyle = {
      zindex: 1,
      position: "absolute",
      bottom: "0px",
      width: "100%",
    };

    return (
      <div style={mapStyler}>
        <Map />
        {/*{modal ? (
          <Modal />
        ) : (*/}
        <Fragment>
          <Fragment>
            <Display />
            <Legend />
            <div style={footerStyle}>
              <Footer />
            </div>
          </Fragment>
        </Fragment>
        {/*)}*/}
      </div>
    );
  }
};

/*function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}*/

//Main = connect(mapStateToProps)(Main)

export default Main;
