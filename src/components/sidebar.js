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
import { addComparisonFeature, removeComparisonFeature } from "../redux/action-creators";
import LocationCompare from "./LocationToCompare";
import LocationDetails from "./LocationDetails";
import Collapsible from "react-collapsible";
import { Switch, Route } from "react-router";
import ComparisonMode from "./ComparisonMode";

class Sidebar extends React.Component {
  static propTypes = {
    select: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object,
    comparisonFeatures: PropTypes.array.isRequired
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

    const isCompared = this.props.comparisonFeatures.find(feature => feature.properties["SA2_MAIN16"] === this.props.selectedFeature.properties["SA2_MAIN16"]) !== undefined;
    
    const ActionButtons = () => (
      <div className="actionButtonsContainer">
        <button className="actionButton"><FavoriteIcon className="icon"/> Add to Favorites</button>
        <button disabled={this.props.comparisonFeatures.length >= 4} className="actionButton" onClick={()=>{isCompared ? removeComparisonFeature(this.props.selectedFeature) : addComparisonFeature(this.props.selectedFeature)}}><ComparisonIcon className="icon"/> {isCompared ? "Remove from Comparison" : "Add to Comparison"}</button>
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
          <Switch>
            <Route exact path="/comparison" render={() => (
              <ComparisonMode />
            )} />
            <Route exact path="/" render={() => (
              <>
                <SASearchField />
                {this.props.selectedFeature ?
                  <>
                    <ActionButtons/>
                    {this.props.comparisonFeatures.length > 0 &&
                      <Collapsible trigger="Locations to Compare" open={true}>
                        <LocationCompare showButton />
                      </Collapsible> 
                    }
                    <LocationDetails feature={this.props.selectedFeature}>
                    </LocationDetails>
                  </>
                  :
                  <>
                    <WelcomeDialog />
                    <Legend/>
                  </>
                }
              </>
            )}  />
          </Switch>
        </div>
      </PanelContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    select: state.select,
    selectedFeature: state.selectedFeature,
    comparisonFeatures: state.comparisonFeatures
  };
}

export default connect(mapStateToProps)(Sidebar);
