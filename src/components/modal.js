import React, { Component } from "react";
import { setModal } from "../redux/action-creators";

let Modal = class Modal extends Component {
  render() {
    const container = {
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      position: "absolute",
      zIndex: 1,
    };
    const modalContent = {
      height: "100%",
      marginLeft: "120px",
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
    };
    const modalBox = {
      width: "450px",
      height: "620px",
      backgroundColor: "#f79640",
      borderRadius: "8px",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    };
    const title = {
      color: "white",
    };
    const content = {
      color: "white",
      fontSize: "13px",
      textAlign: "justify",
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
    };
    return (
      <div style={container}>
        <div style={modalContent}>
          <div style={modalBox}>
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
              <b>The Living Lab</b> is working to better understand social
              interactions and economic behavior within the various communities
              across South Australia in order to introduce new solutions to help
              economic growth and to contribute to employment in South
              Australia. This part of the project includes the design and
              development of a dashboard for visualizing various types of
              behavior and economic activity in South Australia. The basis of
              this dashboard is founded on the lab’s previous studies which
              support the notion that the diversity of interactions and social
              bridges between neighborhoods accurately predict neighborhood
              economic growth. This tool is used to assist the stakeholders in
              South Australia in pinpointing focus areas for urban development
              to drive greater diversity in human flow, or more interactions
              between people of different socio-economic backgrounds, and
              consequently more economic opportunities.
            </p>
            <div style={contentButton}>
              <button style={button} onClick={() => setModal()}>
                Explore the dashboard
              </button>
              <button style={button} onClick={() => setModal()}>
                Take a tour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Modal;
