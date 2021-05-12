import React from "react";

import SidebarButton from "./SidebarButton";

import { ReactComponent as BackIcon} from "../assets/search-icons/back.svg";
import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

import "../css/collapsible.css";
import "../css/sidebar.css";
import { Link } from "react-router-dom";

class ComparisonSidebar extends React.Component {
  
  render() {
    const LocationList = ({locations}) => (
      <ul className="location-list">
        {locations.map(item => (
          <li key={item} className="list-item">
            <span>Location {item}</span>
            <CancelIcon />
          </li>
        ))}
      </ul>      
    )

    const locations = [1,2,3];

    return (
      <div className={`panel-container featureSelected`}>
        <SidebarButton />
        <div className={`sidebar-container`}>
          <div className="sidebarHeader">
            <div className="comparison-title">
              <Link to="/" style={{lineHeight: 0}}>
                <BackIcon />
              </Link>
              <span style={{marginLeft: 10}}>
                Comparing Locations
              </span>
            </div>
          </div>
          <LocationList locations={locations} />
          <div className="sidebar-content">
          </div>
        </div>
      </div>
    );
  }
}

export default (ComparisonSidebar);
