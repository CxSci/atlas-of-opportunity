import React from "react";

import { ReactComponent as BackIcon} from "../assets/search-icons/back.svg";
import "../css/collapsible.css";
import "../css/sidebar.css";
import { Link } from "react-router-dom";
import Collapsible from "react-collapsible";
import LocationCompare from "./LocationToCompare";

class ComparisonSidebarContent extends React.Component {
  
  render() {
    const backButtonStyle = {
      display: "flex",
      alignItems: "center",
      marginRight: 11,
    }

    return (
      <>
        <div className="comparison-title" >
          <Link to="/" style={backButtonStyle}>
            <BackIcon />
          </Link>
          Comparing Locations
        </div>
        <div className="sidebar-content">
          <Collapsible trigger="Locations to Compare" open={true}>
            <LocationCompare />
          </Collapsible>
        </div>
      </>
    );
  }
}

export default (ComparisonSidebarContent);
