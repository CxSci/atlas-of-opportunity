import React, { Component } from "react";
import { Link } from "react-router-dom";

import SidebarDialog from "./SidebarDialog";

let WelcomeDialog = class WelcomeDialog extends Component {

  render() {
    const title = {
      marginBottom: "5px",
      fontWeight: "bold",
      fontSize: "20px",
      lineHeight: "23px",
      textAlign: "center",
    }

    const content = {
      marginTop: 15,
      lineHeight: "150%",
    }

    const linkStyle = {
      alignSelf: "flex-start",
      color: "#0099E5",
    }

    return (
      <SidebarDialog id="welcome">
        <h1 style={title}>Atlas of Opportunity</h1>
        <p style={content}>
          This project is part of a collaborative research initiative
          enabled by principal partner BankSA, MIT Connection Science, the
          South Australian Government and technical partners Optus and
          DSpark . This research is led by MIT Connection Science, its
          Adelaide bigdata Living Lab, and local research institutes
          including University of South Australia and The University of
          Adelaide.
          <br/>
          <br/>
          <Link to="/about" style={linkStyle}>Read more…</Link>
        </p>
      </SidebarDialog>
    );
  }
};

export default WelcomeDialog;
