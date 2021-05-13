import React from "react";

import { ReactComponent as BackIcon} from "../assets/search-icons/back.svg";
import "../css/collapsible.css";
import "../css/sidebar.css";
import { Link } from "react-router-dom";
import Collapsible from "react-collapsible";
import LocationCompare from "./LocationToCompare";

class ComparisonMode extends React.Component {
  
  render() {

    return (
      <>
        <div className="comparison-title">
          <Link to="/" style={{lineHeight: 0}}>
            <BackIcon />
          </Link>
          <span style={{marginLeft: 10}}>
            Comparing Locations
          </span>
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

export default (ComparisonMode);
