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
      pointerEvents: "auto",
      marginBottom: 10,
      flexShrink: 1,
      minHeight: 0,
      top:0
    };
    const modalContent = {
      height: "auto",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      maxHeight: "100%",
      overflow: "auto"
    };
    const modalBox = {
      width: "305px",
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: "5px",
      padding: "30px 35px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "auto",
      position: "relative",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25), 0px -1px 0px rgba(0, 0, 0, 0.1)",
      marginLeft: "10px",
    };
    const title = {
      "fontFamily": "Roboto",
      "fontStyle": "normal",
      "fontWeight": "bold",
      "fontSize": "20px",
      "lineHeight": "23px",
      "textAlign": "center",
      "color": "#333333"
    }
    const content = {
      "fontFamily": "Roboto",
      "fontStyle": "normal",
      "fontWeight": "normal",
      "fontSize": "14px",
      "lineHeight": "133%",
      "color": "#333333",
      marginTop: 15
    }
    const XButton = {
      position: "absolute",
      width: "12px",
      height: "12px",
      right: "15px",
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
              enabled by principal partner BankSA, MIT Connection Science, the
              South Australian Government and technical partners Optus and
              DSpark . This research is led by MIT Connection Science, its
              Adelaide bigdata Living Lab, and local research institutes
              including University of South Australia and The University of
              Adelaide.
            </p>
            <p style={content}>
              The Living Lab works to better understand how social interaction
              and economic behavior impact future outcomes of communities across
              South Australia. This map showcases recent research revealing that
              understanding community movement patterns is crucial for
              understanding economic growth and mobility. Places with more
              diverse movement patterns are more likely to have higher
              near-future economic growth. The goal of the Atlas is to make
              these insights more accessible. Get started below!
            </p>
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
