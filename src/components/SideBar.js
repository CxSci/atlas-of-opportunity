import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SidebarButton from "./SidebarButton";
import SASearchField from "./SASearchField";
import Legend from "./legend";

import { ReactComponent as FavoriteIcon} from "../assets/favorite.svg"
import { ReactComponent as ComparisonIcon} from "../assets/compare.svg"

import "../css/collapsible.css";
import "../css/Sidebar.css";
import WelcomeDialog from "./WelcomeDialog";
import { addComparisonFeature, removeComparisonFeature, setSelectedFeature } from "../redux/action-creators";
import LocationCompare from "./LocationToCompare";
import LocationDetails from "./LocationDetails";
import { Switch, Route, useLocation, useHistory } from "react-router";
import ComparisonSidebarContent from "./ComparisonSidebarContent";
import CollapsibleSection from "./CollapsibleSection";

const Sidebar = (props) => {
    const {
      features,
      selectedFeature,
      comparisonFeatures,
    } = props;
    const location = useLocation();
    const history = useHistory();
    
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
        <button className="actionButton"><FavoriteIcon className="icon"/> Add to Favorites</button>
        <button disabled={enableButton} className="actionButton" onClick={() => comparisonClick(selectedFeature)}>
          <ComparisonIcon className="icon"/>
          {isCompared ? "Remove from Comparison" : "Add to Comparison"}
        </button>
      </div>
    );
    
    // Efect to load features from url ids
    useEffect(() => {
      if (location.pathname.startsWith('/comparison/')) {
        const pathIds = location.pathname.replace('/comparison/', '');
        if (pathIds) {
          const ids = pathIds.split('+');
          const featuresFromUrl = features.filter(ft => ids.includes(ft.properties["SA2_MAIN16"].toString()));
          if (!comparisonFeatures.length) {
            featuresFromUrl.forEach(feature => {
              addComparisonFeature(feature);
            })
            // HACK: set a selectedFeature as the user would do in normal use
            setSelectedFeature(featuresFromUrl[0]);
          }
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features]);

    // Effect to update url when removing comparionFeatures
    useEffect(() => {
      if (location.pathname.startsWith('/comparison/') && features.length) {
        if (!comparisonFeatures.length) {
          history.push('/');
        }
        else {
          const ids = comparisonFeatures.map(feature => feature.properties.SA2_MAIN16);
          const newPath = '/comparison/' + ids.join('+');
          if (location.pathname !== newPath) {
            history.replace(newPath);
          }
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comparisonFeatures]);

    return (
      <div className={`panel-container ${selectedFeature ? "featureSelected" : "noFeatureSelected"}`}>
        <SidebarButton />
        <div className={`sidebar-container`}>
          <Switch>
            <Route path="/comparison/" render={() => (
              <ComparisonSidebarContent />
            )} />
            <Route render={() => (
              <>
                <SASearchField />
                {selectedFeature ?
                  <>
                    <ActionButtons/>
                    {comparisonFeatures.length > 0 &&
                      <CollapsibleSection title="Locations to Compare">
                        <LocationCompare showButton />
                      </CollapsibleSection>
                    }
                    <LocationDetails feature={selectedFeature} comparison={comparisonFeatures}>
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
      </div>
    );
}

Sidebar.propTypes = {
  features: PropTypes.array,
  selectedFeature: PropTypes.object,
  comparisonFeatures: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    features: state.features,
    selectedFeature: state.selectedFeature,
    comparisonFeatures: state.comparisonFeatures
  };
}

export default connect(mapStateToProps)(Sidebar);
