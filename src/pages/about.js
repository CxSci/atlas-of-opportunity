import React, { Component } from "react";

import ModalContainer from "../components/ModalContainer";

import livingLab from "../assets/livinglab.png";
import banksa from "../assets/banksa.png";
import dspark from "../assets/dspark.png";

const About = class About extends Component {
  render() {
    const contentImage = {
      marginTop: "25px",
    };
    const image = {
      width: "130px",
      marginRight: "35px",
    };
    return (
      <ModalContainer title="About the Atlas">
        <p>
          The “MIT bigdata Living Lab” (Living Lab) is a research partnership
          enabled by principal partner BankSA, Massachusetts Institute of
          Technology (MIT), the South Australian Government and technical
          partners Optus and DSpark.
        </p>
        <p>
          The Living Lab works to better understand how social interaction
          and economic behavior impact future outcomes of communities across
          South Australia. This map showcases recent research revealing that
          understanding community movement patterns is crucial for
          understanding economic growth and mobility. Places with more
          diverse movement patterns are more likely to have higher
          near-future economic growth. The goal of the Atlas is to make
          these insights more accessible.
        </p>
        <p>
          Located at Adelaide’s Lot Fourteen’s innovation precinct, the Living
          Lab works closely with local universities, the business community and
          the public sector to safely and securely analyse and present big data.
          It is an example of business, universities and government
          collaborating to help grow the South Australian economy.
        </p>
        <p>
          MIT shares its world leading best practice data analytics methodology
          to the research undertaken through the Living Lab. It follows a
          similar model to those already established in New York, Beijing and
          Istanbul.
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



export default About;
