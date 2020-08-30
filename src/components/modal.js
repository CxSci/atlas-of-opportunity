import React, { Component } from "react";
import { setModal } from "../redux/action-creators";

let Modal = class Modal extends Component {
  render() {
    const container = {
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.3)",
      position: "absolute",
      zIndex: 2,
    };
    const modalContent = {
      height: "100%",
      marginLeft: "120px",
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
    };
    const modalBox = {
      width: "400px",
      height: "600px",
      backgroundColor: "#f79640",
      borderRadius: "10px",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };
    const title = {
      color: "white",
    };
    const button = {
      color: "black",
      backgroundColor: "white",
      padding: "10px",
      borderRadius: "5px",
      fontWeight: "bold",
      ":hover": {
        backgroundColor: "green",
      },
    };
    return (
      <div style={container}>
        <div style={modalContent}>
          <div style={modalBox}>
            <h1 style={title}>Atlas of Opportunity</h1>
            <p></p>
            <button style={button} onClick={() => setModal()}>
              Explore the project
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Modal;
