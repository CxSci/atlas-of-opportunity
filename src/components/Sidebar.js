import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SidebarButton from "./SidebarButton";
import SASearchField from "./SASearchField";
import Legend from "./legend";

//import { ReactComponent as FavoriteIcon} from "../assets/favorite.svg"
import { ReactComponent as ComparisonIcon} from "../assets/compare.svg"

import "../css/collapsible.css";
import "../css/Sidebar.css";
import WelcomeDialog from "./WelcomeDialog";
import { addComparisonFeature, removeComparisonFeature } from "../redux/action-creators";
import LocationCompare from "./LocationToCompare";
import LocationDetails from "./LocationDetails";
import { Switch, Route } from "react-router";
import ComparisonSidebarContent from "./ComparisonSidebarContent";
import CollapsibleSection from "./CollapsibleSection";
import RecommendationDialog from "./RecommendationDialog";

const Sidebar = (props) => {
    const {
      selectedFeature,
      comparisonFeatures,
    } = props;
    
    const isCompared = comparisonFeatures.find(feature => feature.properties["SA2_MAIN16"] === selectedFeature?.properties["SA2_MAIN16"]) !== undefined;
    const enableButton = comparisonFeatures.length >= 4;
    
    const comparisonClick = (feature) => {
      if (isCompared) {
        removeComparisonFeature(feature);
      } else {
        addComparisonFeature(feature);
      }
    }
    
    const ActionButtons = () => (
      <div className="actionButtonsContainer">
        {/*<button className="actionButton"><FavoriteIcon className="icon"/> Add to Favorites</button>*/}
        <button disabled={enableButton} className="actionButton" onClick={() => comparisonClick(selectedFeature)}>
          <ComparisonIcon className="icon"/>
          {isCompared ? "Remove from Comparison" : "Add to Comparison"}
        </button>
      </div>
    );

    return (
      <div className={`panel-container ${(selectedFeature || comparisonFeatures.length) ? "featureSelected" : "noFeatureSelected"}`}>
        <SidebarButton />
        <div className={`sidebar-container`}>
          <Switch>
            <Route path="/comparison/" render={() => (
              <ComparisonSidebarContent />
            )} />
            <Route render={() => (
              <>
                <SASearchField />
                {(selectedFeature || comparisonFeatures.length) ?
                  <>
                    {selectedFeature && <ActionButtons/>}
                    <div className="sidebar-content">
                      {comparisonFeatures.length > 0 &&
                        <CollapsibleSection title="Locations to Compare">
                          <LocationCompare showButton />
                        </CollapsibleSection>
                      }
                      <LocationDetails feature={selectedFeature} comparison={comparisonFeatures}>
                      </LocationDetails>
                    </div>
                  </>
                  :
                  <>
                    <WelcomeDialog />
                    <RecommendationDialog />
                    <Legend/>
                  </>
                }
              </>
            )}  />
          </Switch>
        </div>
      </div>
    );
}

Sidebar.propTypes = {
  selectedFeature: PropTypes.object,
  comparisonFeatures: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    selectedFeature: state.selectedFeature,
    comparisonFeatures: state.comparisonFeatures
  };
}

export default connect(mapStateToProps)(Sidebar);
