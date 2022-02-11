import React, { Component } from "react";
import ModalContainer from "../components/ModalContainer";

const FAQ = class FAQ extends Component {
  render() {
    return (
      <ModalContainer title="FAQ">
        <h1>Privacy</h1>
        <p className="faqQ">
          Where did you obtain the data? Is this legal?
        </p>
        <p>
          The SA2-level census tract data come from collaboration with
          government departments along with telecom and bank companies. It is
          fully compliant with all privacy laws within Australia (and also the
          EU GDPR).
        </p>
        <p className="faqQ">
          Are you singling out individuals?
        </p>
        <p>
          No. We are not interested in individual behavior and are not using
          individual behavior in our analysis. The data is aggregated to SA2
          census tracts, at which point it has no individual level information
          and can be published openly. This is sufficient because we are only
          interested in aggregated trends about the economic, health, and social
          prospects of different neighborhoods. Our final data consists of
          aggregations (counts) at the level of census tract areas, not
          individuals.
        </p>
      </ModalContainer>
    );
  }
};

export default FAQ;
