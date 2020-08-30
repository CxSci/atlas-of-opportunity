import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Map from "./components/map";
import Display from "./components/display";
import Legend from "./components/legend";
import Modal from "./components/modal";
import Header from "./components/header";
import Contact from "./components/contact";
import Project from "./components/project";
import About from "./components/about";
import Research from "./components/research";
import Methods from "./components/methods";
import Footer from "./components/footer.js";

import { mapStyler, footerStyle } from "./styles/app.js";

const Application = class Application extends Component {
  static propTypes = {
    modal: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
  };

  render() {
    const { modal, header } = this.props;

    return (
      <React.Fragment>
        <div style={mapStyler}>
          <Map />
          {header === "methods" && <Methods />}
          {header === "research" && <Research />}
          {header === "project" && <Project />}
          {header === "about" && <About />}
          {header === "contact" && <Contact />}
          {modal ? (
            <Modal />
          ) : (
            <Fragment>
              <Header />
              {header === "map" && (
                <Fragment>
                  <Display />
                  <Legend />
                  <div style={footerStyle}>
                    <Footer />
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
    header: state.header,
  };
}

export default connect(mapStateToProps)(Application);
