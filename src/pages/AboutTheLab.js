import React, { Component } from "react";

import ModalContainer from "../components/ModalContainer";

import livingLab from "../assets/livinglab.png";
import banksa from "../assets/banksa.png";
import dspark from "../assets/dspark.png";

const AboutTheLab = class About extends Component {
  render() {
    const contentImage = {
      marginTop: "25px",
    };
    const image = {
      width: "130px",
      marginRight: "35px",
    };
    return (
      <ModalContainer title="About the Lab">
        <p>
          The MIT Big Data Living Lab is a collaborative research initiative led by the Government of South Australia in partnership and participation with the Massachusetts Institute of Technology (MIT), Bank SA, Optus and DSpark, the Living Lab will work to better understand social interactions within the various communities across South Australia.
        </p>
        <p>
          Located at Adelaide’s Lot Fourteen’s innovation precinct, the Living Lab works closely with local universities, the business community and the public sector to safely and securely analyse and present big data. It is an example of business, universities and government collaborating to help grow the South Australian economy.
        </p>
        <p>
          MIT shares its world leading best practice data analytics methodology to the research undertaken through the Living Lab. It follows a similar model to those already established in New York, Beijing and Istanbul.
        </p>
        <p>
          Further information on the MIT Big Data Living Lab can be found at <a href="https://dti.sa.gov.au/industry/big-data-living-lab" target="_blank" rel="noopener noreferrer" >https://dti.sa.gov.au/industry/big-data-living-lab</a>
        </p>
        <p>
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

export default AboutTheLab;
