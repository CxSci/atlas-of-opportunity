import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setModal } from "../redux/action-creators";
import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";

let Modal = class Modal extends Component {
  static propTypes = {
    showModal: PropTypes.bool.isRequired,
  };

  render() {
    //If dismissed render a react fragment which renders nothing to the DOM
    //This is not persistent and only lasts in memory for the duration of the browser tab being open
    if (!this.props.showModal) return <></>;

    const container = {
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      position: "absolute",
      zIndex: 2,
      pointerEvents: "auto",
    };
    const modalContent = {
      height: "83%",
      marginLeft: "10px",
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
      marginBottom: "10%",
    };
    const modalBox = {
      width: "305px",
      height: "490px",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "auto",
      position: "relative",
    };
    const title = {
      color: "black",
      marginTop: 10,
      marginBottom: 10,
    };
    const content = {
      color: "black",
      fontSize: "13px",
      textAlign: "justify",
      marginTop: 10,
      marginBottom: 10,
    };
    const contentButton = {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
    };
    const button = {
      color: "black",
      backgroundColor: "white",
      padding: "8px",
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "12px",
      border: "black 1px solid",
      cursor: "pointer",
    };
    const XButton = {
      position: "absolute",
      width: "12px",
      height: "12px",
      right: "10px",
      top: "12px",
      cursor: "pointer",
    };

    return (
      <div style={container}>
        <div style={modalContent}>
          <div style={modalBox}>
            <div style={XButton}>
              <CloseIcon onClick={() => setModal(false)} />
            </div>
            <h1 style={title}>Atlas of Opportunity</h1>
            <p style={content}>
              This project is part of a collaborative research initiative
              enabled by principal partner{" "}
              <b>
                BankSA, MIT Connection Science, the South Australian Government
                and technical partners Optus and DSpark
              </b>
              . This research is led by MIT Connection Science, its Adelaide
              bigdata Living Lab, and local research institutes including
              University of South Australia and The University of Adelaide.
            </p>
            <p style={content}>
              The <b> Living Lab</b> works to better understand how social
              interaction and economic behavior impact future outcomes of
              communities across South Australia. This map showcases recent
              research revealing that understanding community movement patterns
              is crucial for understanding economic growth and mobility. Places
              with more diverse movement patterns are more likely to have higher
              near-future economic growth. The goal of the Atlas is to make
              these insights more accessible. Get started below!
            </p>
            <div style={contentButton}>
              <button
                style={{ ...button, width: 100, textAlign: "center" }}
                onClick={() => setModal(false)}
              >
                Explore the dashboard
              </button>
              <button style={button} onClick={() => setModal(false)}>
                Take a tour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    showModal: state.showModal,
  };
}

export default connect(mapStateToProps)(Modal);
