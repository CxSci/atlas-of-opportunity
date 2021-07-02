import React, { Component } from "react";

import ModalContainer from "../components/ModalContainer";

const AboutTheAtlas = class About extends Component {
  render() {
    return (
      <ModalContainer title="About the Atlas">
        <p>
          The Atlas showcases recent research revealing that understanding community movement patterns is crucial for understanding economic growth and mobility. Places with more diverse movement patterns are more likely to have higher near-future economic growth. The goal of the Atlas is to make these insights more accessible. The team utilizes data analytics to produce insights for people, business owners, and authorities and help making informed decisions.
        </p>
        <p>
          This website can inform a new generation of data-informed strategies and advanced methods that are used to understand how human behavior (e.g. movements, spending) shapes economic prosperity. The current map intends to provide insights for small business owners and help them make informed decisions about the location for starting their new business or subsidiary branch.
        </p>
        <p>
          Users can find a wide variety of information about each Statistical Area Level 2 (SA2). The data include information about sociodemographic, economic, spending, and mobility data. Difference indices and prediction measures are provided that could be useful for business owners to make better decisions.
        </p>
        <p>
          The comparison tool enables users to compare different features for different SA2s based on their choice. Users can also get the top four relevant SA2s based on the information they enter in the recommender tool and then compare them.
        </p>
        <p>
          To help improve this tool, please let us know your comments and feedback <a href="https://docs.google.com/forms/d/e/1FAIpQLSf-dAa5_0qG5V_cONxR1MXVuhJfpgjp5iIS-ZBtvoMoa3q4-A/viewform" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </ModalContainer>
    );
  }
};

export default AboutTheAtlas;
