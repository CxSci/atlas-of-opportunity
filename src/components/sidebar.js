import React, {Fragment} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SidebarButton from "./SidebarButton";
import SASearchField from "./SASearchField";
import Legend from "./legend";

import { ReactComponent as FavoriteIcon} from "../assets/favorite.svg"
import { ReactComponent as ComparisonIcon} from "../assets/compare.svg"

import "../css/collapsible.css";
import "../css/sidebar.css";
import WelcomeDialog from "./WelcomeDialog";
import LocationDetails from "./LocationDetails";

class Sidebar extends React.Component {
  static propTypes = {
    select: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object,
  };

  render() {

    const PanelContainer = (props) => {
      const featureSelected = this.props.selectedFeature
        ? "featureSelected"
        : "noFeatureSelected";
      return (
        <div className={`panel-container ${featureSelected}`}>
          {props.children}
        </div>
      )
    }
    
    const ActionButtons = () => (
      <div className="actionButtonsContainer">
        <button className="actionButton"><FavoriteIcon className="icon"/> Add to Favorites</button>
        <button className="actionButton"><ComparisonIcon className="icon"/> Add to Comparison</button>
      </div>

    );

    // const featureDebug = (feature) => {
    //   if (!feature || !feature.properties) {
    //     return ""
    //   }
    //   return (
    //     <ul className="sidebar-content">
    //     {
    //       Object.keys(feature.properties).map((key) => (
    //         <li key={key}>{key}: {feature.properties[key]}</li>
    //       ))
    //     }
    //     </ul>
    //   )
    // }

    return (
      <PanelContainer>
        <SidebarButton />
        <div className={`sidebar-container`}>
          <SASearchField />
          {this.props.selectedFeature ?
            <>
              <ActionButtons/>
              <LocationDetails feature={this.props.selectedFeature} />
            </>
            :
            <>
              <WelcomeDialog />
              <Legend/>
            </>
          }
        </div>
      </PanelContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    select: state.select,
    selectedFeature: state.selectedFeature,
  };
}

export default connect(mapStateToProps)(Sidebar);
