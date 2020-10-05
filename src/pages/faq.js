import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setModal } from "../redux/action-creators";

import Container from "../components/container";

const FAQ = class FAQ extends Component {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (this.props.modal === true) {
      setModal(false);
    }
  }

  render() {
    const content = {
      fontSize: "16px",
      textAlign: "justify",
      marginBottom: "15px",
    };
    return (
      <Container title="FAQ">
        <br />
        <h2>Privacy</h2>
        <p style={content}>
          <b>Where did you obtain the data? Is this legal?</b>
          <br />
          The SA2-level census tract data come from collaboration with
          government departments along with telecom and bank companies. It is
          fully compliant with all privacy laws within Australia (and also the
          EU GDPR).
          <br />
          <br />
          <b>Are you singling out individuals?</b>
          No. We are not interested in individual behavior and are not using
          individual behavior in our analysis. The data is aggregated to SA2
          census tracts, at which point it has no individual level information
          and can be published openly. This is sufficient because we are only
          interested in aggregated trends about the economic, health, and social
          prospects of different neighborhoods. Our final data consists of
          aggregations (counts) at the level of census tract areas, not
          individuals.
        </p>
      </Container>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps)(FAQ);
