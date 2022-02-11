import React, { Component } from "react";
import { Link } from "react-router-dom";

import SidebarDialog from "./SidebarDialog";
import { setHamburgerMenuOpen } from "../redux/action-creators";

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
          Recent research has revealed a connection between people&apos;s mobility and the economy — areas with diverse community movement patterns are more likely to experience higher economic growth. This version of the Atlas aims to make such insights accessible to small business owners and government planners.
          <br/>
          <br/>
          <Link
            onClick={() => setHamburgerMenuOpen(true)}
            style={linkStyle}
          >
            Read more…
          </Link>
        </p>
      </SidebarDialog>
    );
  }
};

export default WelcomeDialog;
