import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setModal } from "../redux/action-creators";

import livingLab from "../assets/livinglab.png";
import banksa from "../assets/banksa.png";
import dspark from "../assets/dspark.png";

import Container from "../components/container";

const About = class About extends Component {
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
    const contentImage = {
      marginTop: "25px",
    };
    const image = {
      width: "130px",
      marginRight: "35px",
    };
    const link = {
      color: "#f79640",
    };
    return (
      <Container title="About">
        <p style={content}>
          The “MIT bigdata Living Lab” (Living Lab) is a research partnership
          enabled by principal partner BankSA, Massachusetts Institute of
          Technology (MIT), the South Australian Government and technical
          partners Optus and DSpark.
        </p>
        <p style={content}>
          Located at Adelaide’s Lot Fourteen’s innovation precinct, the Living
          Lab works closely with local universities, the business community and
          the public sector to safely and securely analyse and present big data.
          It is an example of business, universities and government
          collaborating to help grow the South Australian economy.
        </p>
        <p style={content}>
          MIT shares its world leading best practice data analytics methodology
          to the research undertaken through the Living Lab. It follows a
          similar model to those already established in New York, Beijing and
          Istanbul.
        </p>
        <div style={content}>
          Further information on the MIT Big Data Living Lab can be found on
          <br />
          <a
            href="https://dti.sa.gov.au/industry/big-data-living-lab" target="_blank"
            style={link}
          >
            https://dti.sa.gov.au/industry/big-data-living-lab
          </a>
        </div>
        <div style={contentImage}>
          <img style={image} src={livingLab} alt={""} />
          <img style={image} src={banksa} alt={""} />
          <img style={image} src={dspark} alt={""} />
        </div>
      </Container>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps)(About);
