import React, { Component } from "react";
import MathJax from "react-mathjax2";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setModal } from "../redux/action-creators";

import adelaide from "../assets/adelaide.png";
import segregation from "../assets/segregation.png";

import Container from "../components/container";

const Methods = class Methods extends Component {
  static propTypes = {
    modal: PropTypes.string.isRequired,
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
    const formula = {
      width: "100%",
      fontSize: "25px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "10px 0 15px 0",
    };
    const image = {
      width: "100%",
    };
    return (
      <Container title="Methods">
        <br />
        <MathJax.Context>
          <div>
            <h2>Measuring income inequality</h2>
            <p style={content}>
              This tool shows the level of economic inequality at SA2 regions of
              South Australia. Each SA2 has visitors from different
              socio-economic backgrounds. The visitors are divided into four
              income groups based on the median income of the neighborhood they
              live in. The visitors’ home location is inferred from the mobility
              data, and the income data is provided by Australian Bureau of
              Statistics. The tool measures how diverse the visitors of a
              region are based on their income level. Our inequality metric for
              each region j is calculated based on the following formula, where{" "}
              <MathJax.Node inline>{" q_i,(i=1,2,3,4)"}</MathJax.Node>{" "}
              represents the income quartile and{" "}
              <MathJax.Node inline>{"t_(q_(ij))"}</MathJax.Node> is the time
              spent by income quartile i at region j.
            </p>
            <div style={formula}>
              <b>inequality</b>
              <MathJax.Node inline>
                {" j = sum_(i=1)^4 t_(q_(ij)) - 1/4 V"}
              </MathJax.Node>
            </div>
            <p style={content}>
              After post-stratification and calculation of the inequality level
              for each region, we normalize them to numbers [0,100], where a
              score of 0 means that visitors are from all income groups equally,
              and 100 represents the maximum inequality level, where visitors
              are only from a single income group.
            </p>
          </div>
        </MathJax.Context>
        <br />
        <h2>The Atlas</h2>
        <p style={content}>
          Figure 1 shows a screenshot of the tool for South Australia.
          Each polygon represents a SA2 region. Regions are colored in a range
          of Red-Yellow-Blue. The darker the colors Red and Blue, the higher
          segregation. Blue shows the regions where inequality happens because
          higher income (above median) people spend more time there and Red
          shows the lower income (under median) domination on visits.
        </p>
        <br />
        <img style={image} src={adelaide} alt={""} />
        <p>Figure 1. Screenshot of the Adelaide Economic Segregation Map</p>
        <br />
        <br />
        <h2>Discussion</h2>
        <p style={content}>
          Figure 2, shows the histogram of the
          inequality metric at SA2 level in South Australia.
        </p>
        <br />
        <img style={image} src={segregation} alt={""} />
        <p>Figure 1. Screenshot of the Adelaide Economic Segregation Map</p>
        <p style={content}>
          The bars at left side of figure 2, represent the areas with inequality
          dominated by lower income groups and the blue ones at right are
          dominated by the higher income groups. There are different policies to discourage social
          segregation that is so stratified. One can be through locating the new
          facilities and amenities in those areas that could decrease the
          segregation by attracting the target income level groups. Data-driven
          maps like the one shown here could be used to construct models that
          can help predict where amenities might be incentivized so as to reduce
          segregation. To illustrate, assume that the SA government built a park
          at “Plympton” area January 2018. Using the inequality measures before
          and after that particular month will inform how a park can change the segregation
          level which can be considered for future location allocations.
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

export default connect(mapStateToProps)(Methods);
