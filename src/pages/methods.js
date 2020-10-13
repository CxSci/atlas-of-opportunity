import React, { Component } from "react";
import { MathComponent } from "mathjax-react";
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
          The Atlas of Opportunity showcases recent research finding that shared
          workplaces between two neighborhoods can create what we call "social
          bridges" between communities. We've found that people in communities
          that are linked together by these bridges influence each other's
          behavior. These bridges are more predictive of community similarity
          and other indicators than traditional measures, like income and
          socio-demographics. This important result suggests that understanding
          behavior at aggregate scales that preserve individual privacy can help
          cities and communities plan policy and design for the future more
          effectively.
        </p>
        <br />
        <img style={image} src={flow} alt={""} />
        <p>
          Social bridges act as links between different communities. In this
          example, communities I and J each have residents that visit the same
          restaurant, grocery store, and local business near their work
          locations, creating three social bridges between I and J.
        </p>
        <br />
        <p style={content}>
          We define communities as administrative areas, like census tracts or
          other statistical areas. In some places, they can vary from as small
          as 0.05 square kilometers in city centers to 50 square kilometers in
          more rural areas. To calculate the number of social bridges between
          two communities, we use census-like sources of aggregate behavior that
          preserve individual privacy. These kinds of aggregate data are usually
          provided by government agencies, telecom companies, or banks in
          aggregate form for standard auditing or regulatory purposes. Here,
          that data can be used to learn more about the future of communities
          and plan better policy.
        </p>
        <div>
          <p style={content}>
            We define social bridges between each pair of communities{" "}
            <MathComponent display={false} tex={String.raw`I`} /> and{" "}
            <MathComponent display={false} tex={String.raw`J`} /> to capture the
            chance of physical proximity and/or social learning taking place
            between them. Specifically, we define a social bridge between a pair
            of communities <MathComponent display={false} tex={String.raw`I`} />{" "}
            and <MathComponent display={false} tex={String.raw`J`} /> , for
            every pair of individuals{" "}
            <MathComponent display={false} tex={String.raw`i`} /> and{" "}
            <MathComponent display={false} tex={String.raw`j`} /> that live
            respectively in{" "}
            <MathComponent display={false} tex={String.raw`I`} /> and{" "}
            <MathComponent display={false} tex={String.raw`J`} /> and have work
            locations <MathComponent display={false} tex={String.raw`L_i`} />{" "}
            and <MathComponent display={false} tex={String.raw` L_j `} /> within
            a distance threshold <MathComponent display={false} tex={String.raw`d`} />. Therefore, the number of social bridges
            between <MathComponent display={false} tex={String.raw`I`} /> and{" "}
            <MathComponent display={false} tex={String.raw`J`} /> is:
          </p>
          <div style={formula}>
            <p style={{ margin: "7px 0 0 0" }}>bridge</p>
            <MathComponent
              tex={String.raw`(I, J) = |\{i,j\}|, s.t.i \in I, j \in J,D(L_i, L_j) \le d,(1)`}
            />
          </div>
          <p style={content}>
            where{" "}
            <MathComponent display={false} tex={String.raw` D(L_i, L_j)`} />{" "}
            represents the distance between{" "}
            <MathComponent display={false} tex={String.raw` L_i `} /> and{" "}
            <MathComponent display={false} tex={String.raw` L_j `} />. This
            statistic and models built from it rely on the assumption that
            people who work near one another are more likely to interact or see
            one another in daily life. We define two workplaces (in statistical
            areas) as nearby if they are below a particular distance threshold{" "}
            <MathComponent display={false} tex={String.raw`d`} />. In detailed
            behavioral studies, this turns out to be reasonable -- people are
            more likely to see or interact with one another through repeated,
            constant peripheral contact. would have a reasonable chance to
            observe and interact with each other due to constant and repeated
            exposure promoted by physical proximity.{" "}
          </p>
          <p style={content}>
            When we have access to neighborhood-level data that reveals which
            points of interest (POIs) residents spend time at, we also define
            social bridges by the "third places" people share, such as
            restaurants and cafes.
          </p>
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

export default connect(mapStateToProps)(Methods);
