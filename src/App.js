import React from "react";
import { setActiveOption } from "./redux/action-creators";
import Map from "./components/map";
import Toggle from "./components/toggle";
import Display from "./components/display";
import Legend from "./components/legend";
import Modal from "./components/modal";
import StickyFooter from "react-sticky-footer";
import Footer from "./Footer/Footer.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Application = class Application extends React.Component {
  static propTypes = {
    modal: PropTypes.string.isRequired,
  };

  render() {
    const { modal } = this.props;
    const mapStyle = {
      zIndex: 0,
    };
    const footerStyle = {
      zIndex: 1,
      position: "absolute",
      bottom: "0px",
    };
    return (
      <React.Fragment>
        <div style={mapStyle}>
          <Map />
          {modal ? (
            <Modal />
          ) : (
            <div>
              <Toggle onChange={setActiveOption} />
              <Display />
              <Legend />
              <div style={footerStyle}>
                <StickyFooter
                  bottomThreshold={50}
                  normalStyles={{
                    backgroundColor: "rgba(153, 153, 153, 0)",
                    padding: "0.5rem",
                  }}
                  stickyStyles={{
                    backgroundColor: "rgba(255,255,255,.8)",
                    padding: "2rem",
                  }}
                >
                  <Footer />
                </StickyFooter>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps)(Application);
