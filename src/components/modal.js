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

    const modalBox = {
      width: "305px",
      flexGrow: 0,
      backgroundColor: "#FFFFFF",
      borderRadius: "5px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25), 0px -1px 0px rgba(0, 0, 0, 0.1)",
      marginTop: "5px",
      marginBottom: "10px",
      marginLeft: "10px",
      pointerEvents: "auto",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    };

    const scrollingWrapper = {
      padding: "30px 35px",
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
      color: "#333333",
      fontSize: "14px",
      lineHeight: "140%",
    }

    const title = {
      marginBottom: "5px",
      fontWeight: "bold",
      fontSize: "20px",
      lineHeight: "23px",
      textAlign: "center",
    }

    const content = {
      marginTop: 15,
    }

    const xButton = {
      position: "absolute",
      width: "12px",
      height: "12px",
      top: "12px",
      right: 0,
      cursor: "pointer",
    };

    return (
      <div style={modalBox}>
        <CloseIcon onClick={() => setModal(false)} style={xButton} />
        <div style={scrollingWrapper}>
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
            these insights more accessible.
          </p>
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
