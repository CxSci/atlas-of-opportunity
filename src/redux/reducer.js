import * as Constants from "../constants";
import geojsonURL from "../data/SA_dashboard.geojson";
import OsiPoiUrl from "../data/OSM_POIs.geojson";

const options = {};

options[Constants.MAP_TYPE.GROWTH] = {
  name: "Growth",
  description: "",
  property: "income_diversity",
  legendName: "Growth Potential",
  stops: [
    [0, "#fdedc4"],
    [0.6, "#f09647"],
    [1.2, "#dd4b27"],
  ],
  bridgeKeys: {
    inflow: ["inflow_r1", "inflow_r2", "inflow_r3"],
    outflow: ["outflow_r1", "outflow_r2", "outflow_r3"],
    bidirectional: ["bridge_rank1", "bridge_rank2", "bridge_rank3"],
  },
};

options[Constants.MAP_TYPE.TRANSACTIONS] = {
  name: "transactions",
  description: "",
  property: "income_diversity",
  legendName: "Growth Potential",
  stops: [
    [0, "#cce7ff"],
    [0.6, "#47a1f0"],
    [1.2, "#2e90e6"],
  ],
  bridgeKeys: {
    inflow: ["gain_r1", "gain_r2", "gain_r3"],
    outflow: ["spent_r1", "spent_r2", "spent_r3"],
    bidirectional: ["exchanged_r1", "exchanged_r2", "exchanged_r3"],
  },
};

options[Constants.MAP_TYPE.SEGREGATION] = {
  name: "Inequality",
  description: "Inequality in time spent",
  property: "inequality",
  legendName: "Inequality Index",
  stops: [
    [0, "#fdedc4"],
    [40, "#f09647"],
    [60, "#dd4b27"],
  ],
};

options[Constants.MAP_TYPE.BUSINESS] = {
  name: "Business",
  description: "",
  property: "",
  legendName: "Business",
  stops: [],
}

const initialState = {
  geojsonURL,
  features: [], // Fetched asynchronously on app load
  poiFeatures: [],
  comparisonFeatures: [],
  collapsibleState: {},
  options,
  active: options[Constants.MAP_TYPE.GROWTH],
  mapType: Constants.MAP_TYPE.GROWTH,
  path: window.location.pathname,
  dropdown: "off",
  flowDirection: Constants.FLOW_BI,
  searchBarInfo: [121, -26.5],
  sidebarOpen: true,
  selectedFeature: null,
  highlightedFeature: null,
  showWelcomeDialog: true,
  comparisonType: Constants.COMPARISON_TYPE.TABLE,
};

function fetchFeatures() {
  return fetch(geojsonURL);
}

function fetchPOI() {
  return fetch(OsiPoiUrl);
}

function loadFeatures() {
  return function (dispatch) {
    return fetchFeatures()
      .then((response) => response.json())
      .then(
        (collection) =>
          dispatch({ type: "FEATURES", payload: collection.features }),
        // TODO: Add proper error handling
        (error) => {
          console.log(error);
        }
      );
  };
}

function loadPOI() {
  return function(dispatch) {
    return fetchPOI()
    .then(response => response.json())
    .then(collection => dispatch({ type: "POI", payload: collection.features }))
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case "FEATURES":
      return Object.assign({}, state, {
        features: action.payload,
      });
    case "POI":
      return Object.assign({}, state, {
        poiFeatures: action.payload
      })
    case Constants.SET_ACTIVE_OPTION:
      return Object.assign({}, state, {
        active: action.option,
      });
    case Constants.SHOW_WELCOME_DIALOG:
      return {
        ...state,
        showWelcomeDialog: action.payload,
      };
    case "Header":
      return Object.assign({}, state, {
        path: action.payload,
      });
    case "MapType":
      return {
        ...state,
        mapType: action.payload,
        active: options[action.payload],
      };
    case "DropDown":
      return Object.assign({}, state, {
        dropdown: action.payload,
      });
    case Constants.SET_FLOW_DIRECTION:
      return Object.assign({}, state, {
        flowDirection: action.direction,
      });
    case Constants.SET_SEARCH_BAR_INFO:
      return Object.assign({}, state, {
        searchBarInfo: action.payload,
      });
    case Constants.SET_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpen: action.payload,
      });
    case Constants.SET_SELECTED_FEATURE:
      return Object.assign({}, state, {
        selectedFeature: action.feature,
      });
    case Constants.SET_HIGHLIGHTED_FEATURE:
      return Object.assign({}, state, {
        highlightedFeature: action.feature,
      });
    case Constants.ADD_COMPARISON_FEATURE:
    {
      let collapsibleState = state.collapsibleState;
      collapsibleState['Locations to Compare'] = true;
      return {
        ...state,
        collapsibleState,
        comparisonFeatures: state.comparisonFeatures.concat([action.feature])
      };
    }
    case Constants.REMOVE_COMPARISON_FEATURE:
      return {...state, comparisonFeatures: state.comparisonFeatures.filter(feature => feature.properties["SA2_MAIN16"] !== action.feature.properties["SA2_MAIN16"])}
    case Constants.UPDATE_COLLAPSIBLE_STATE:
      return {
        ...state, 
        collapsibleState: action.payload
      };
    case Constants.SET_COMPARISON_TYPE:
      return {
        ...state, 
        comparisonType: action.payload
      };
    default:
      return state;
  }
}

export { reducer, initialState, loadFeatures, loadPOI };
