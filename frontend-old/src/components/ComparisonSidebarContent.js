import React from "react";

import { ReactComponent as BackIcon} from "../assets/search-icons/back.svg";
import "../css/collapsible.css";
import "../css/Sidebar.css";
import { Link } from "react-router-dom";
import Collapsible from "react-collapsible";
import LocationCompare from "./LocationToCompare";
import Map from './map'

const miniMap = {
  width: 300,
  height: 300,
  marginLeft: -20,
  marginTop: 5
}
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
          <Collapsible trigger="Map" open={true}>
            <div style={miniMap}>
              <Map mini={true}/>
            </div>
          </Collapsible>
        </div>
      </>
    );
  }
}

export default (ComparisonSidebarContent);
