import React, { Component } from "react";
import MathJax from "react-mathjax2";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setModal } from "../redux/action-creators";

import flow from "../assets/flow.png";

import Container from "../components/container";

const Methods = class Methods extends Component {
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
        <p style={content}>
          The understanding and modeling of human purchase behavior in city
          environment can have important implications in the study of urban
          economy and in the design and organization of cities. In the Atlas of
          Opportunity, we study human behavior at the community level and argue
          that people who live in different communities but work at close-by
          locations could act as “social bridges” between the respective
          communities and these bridges strongly influence community behavior.
          More specifically, we have shown that the number of social bridges
          between communities is a much stronger indicator of similarity in
          community behavior than traditionally considered factors such as
          income and socio-demographic variables.
        </p>
        <br />
        <img style={image} src={flow} alt={""} />
        <p>
          Fig. 1. Social bridges link behavior of different communities of city
          residents. In this example, communities I and J have three social
          bridges between them, which are formed by three pairs of
          point-of-interest visitation having close-by work locations.{" "}
        </p>
        <br />
        <p style={content}>
          To study social bridges between different communities and how this
          similarity is associated to physical proximity, we first need to
          define such communities. In the country under investigation,
          communities can naturally be defined as fine-scale administrative
          neighborhoods within a city. These are neighborhoods of varying areas
          from 0.05 square kilometers in the city center to 50 square kilometers
          in the periphery of the city area, whose residents normally share to
          some extent common socio-demographic characteristics. To compute these
          social bridges we use census-like sources of aggregate behavior, which
          contain no personally identifiable information. These aggregate
          census-tract data are provided by government agencies,
          telecommunications, and banking, similar to the manner in which these
          organizations provide aggregate data for standard auditing and
          regulatory purposes.
        </p>
        <MathJax.Context>
          <div>
            <p style={content}>
              Social bridges between each pair of communities I and J can be
              defined in order to capture the chance of physical proximity
              and/or social learning taking place between people from the
              respective communities. Specifically, we define a social bridge
              between a pair of communities I and J , for every pair of
              individuals i and j that live respectively in I and J and have
              work locations <MathJax.Node inline>{" L_i"}</MathJax.Node> and{" "}
              <MathJax.Node inline>{" L_j "}</MathJax.Node> within a distance
              threshold d. Therefore, the number of social bridges between I and
              J is:
            </p>
            <div style={formula}>
              <p style={{ margin: "7px 0 0 0" }}>bridge</p>
              <MathJax.Node inline>
                {"(I, J) = |{i, j}|, s.t.i in I, j in J, D(L_i, L_j) <= d,(1)"}
              </MathJax.Node>
            </div>
            <p style={content}>
              where <MathJax.Node inline>{" D(L_i, L_j)"}</MathJax.Node>{" "}
              represents the distance between{" "}
              <MathJax.Node inline>{" L_i "}</MathJax.Node> and{" "}
              <MathJax.Node inline>{" L_j "}</MathJax.Node>. Since people
              normally spend a considerable amount of time at work, it is our
              assumption that individuals who work at near-by locations, defined
              by a distance threshold d, would have a reasonable chance to
              observe and interact with each other due to constant and repeated
              exposure promoted by physical proximity. In detailed behavioral
              studies, this turns out to be quite an accurate assumption. Note
              that we may also use the so-called “third places” to define social
              bridges instead of work locations.
            </p>
          </div>
        </MathJax.Context>
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
