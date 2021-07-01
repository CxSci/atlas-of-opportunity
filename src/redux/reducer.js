import * as Constants from "../constants";
import geojsonURL from "../data/SA_dashboard.geojson";
import osmPOIURL from "../data/OSM_POIs.geojson";
import anzsicCodes from "../data/anzsic_codes.json";

const mapLayers = {};

mapLayers[Constants.MAP_TYPE.GROWTH] = {
  key: Constants.MAP_TYPE.GROWTH,
  name: "Small Business Decision Support",
  description: "GDP Growth Potential",
  property: "income_diversity",
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

// mapLayers[Constants.MAP_TYPE.TRANSACTIONS] = {
//   key: Constants.MAP_TYPE.TRANSACTIONS,
//   name: "Financial Interactions - Growth Potential",
//   description: "",
//   property: "income_diversity",
//   stops: [
//     [0, "#cce7ff"],
//     [0.6, "#47a1f0"],
//     [1.2, "#2e90e6"],
//   ],
//   bridgeKeys: {
//     inflow: ["gain_r1", "gain_r2", "gain_r3"],
//     outflow: ["spent_r1", "spent_r2", "spent_r3"],
//     bidirectional: ["exchanged_r1", "exchanged_r2", "exchanged_r3"],
//   },
// };

// mapLayers[Constants.MAP_TYPE.SEGREGATION] = {
//   key: Constants.MAP_TYPE.SEGREGATION,
//   name: "Economic Segregation - Inequality Index",
//   description: "Inequality in time spent",
//   property: "inequality",
//   stops: [
//     [0, "#fdedc4"],
//     [40, "#f09647"],
//     [60, "#dd4b27"],
//   ],
// };

mapLayers[Constants.MAP_TYPE.BUSINESSES] = {
  key: Constants.MAP_TYPE.BUSINESSES,
  name: "Business POIs",
  description: "",
  property: "",
  stops: [],
}

const initialState = {
  geojsonURL,
  features: [], // Fetched asynchronously on app load
  poiFeatures: [], // "
  anzsicCodes: anzsicCodes,
  comparisonFeatures: [],
  collapsibleState: {"Demographic Summary": true},
  mapLayers,
  activeLayer: mapLayers[Constants.MAP_TYPE.GROWTH],
  mapType: Constants.MAP_TYPE.GROWTH,
  path: window.location.pathname,
  dropdown: "off",
  flowDirection: Constants.FLOW_BI,
  searchBarInfo: [121, -26.5],
  sidebarOpen: true,
  selectedFeature: null,
  highlightedFeature: null,
  hiddenSidebarDialogs: [],
  hamburgerMenuOpen: false,
  comparisonType: Constants.COMPARISON_TYPE.TABLE,
};

function fetchFeatures() {
  return fetch(geojsonURL);
}

function fetchPOI() {
  return fetch(osmPOIURL);
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
          // eslint-disable-next-line no-console
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
    case Constants.HIDE_SIDEBAR_DIALOG:
      return {
        ...state,
        hiddenSidebarDialogs: 
          [...new Set([...state.hiddenSidebarDialogs, action.payload])],
      }
    case Constants.SET_ACTIVE_MAP_LAYER:
      return {
        ...state,
        mapType: action.payload,
        activeLayer: mapLayers[action.payload],
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
    case Constants.SET_HAMBURGER_MENU_OPEN:
      return {
        ...state,
        hamburgerMenuOpen: action.payload,
      }
    case Constants.SET_COMPARISON_TYPE:
      return {
        ...state, 
        comparisonType: action.payload
      };
    case Constants.SET_SAVED_MAP_POSITION:
      return {
        ...state,
        savedMapPosition: action.payload,
      }
    default:
      return state;
  }
}

export { reducer, initialState, loadFeatures, loadPOI };
