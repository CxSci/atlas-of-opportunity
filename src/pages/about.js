import React, { Component } from "react";
import livingLab from "../assets/livinglab.png";
import banksa from "../assets/banksa.png";
import dspark from "../assets/dspark.png";

import ModalContainer from "../components/ModalContainer";

const About = class About extends Component {
  render() {
    const content = {
      fontSize: "14px",
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
      <ModalContainer title="About the Atlas">
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
            href="https://dti.sa.gov.au/industry/big-data-living-lab" target="_blank" rel="noopener noreferrer"
            style={link}
          >
            https://dti.sa.gov.au/industry/big-data-living-lab
          </a>
        </div>
        <p style={content}>
          For questions and comments about the Atlas of Opportunity, please email <a href="mailto:opportunity@mit.edu">opportunity@mit.edu</a>.
        </p>
        <div style={contentImage}>
          <img style={image} src={livingLab} alt={""} />
          <img style={image} src={banksa} alt={""} />
          <img style={image} src={dspark} alt={""} />
        </div>
      </ModalContainer>
    );
  }
};



export default About;
