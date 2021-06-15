import React, { Component } from "react";

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
      </SidebarDialog>
    );
  }
};

export default WelcomeDialog;
