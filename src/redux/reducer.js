import * as Constants from "../constants";
import data from "../data/SA_dashboard.geojson";

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

/*
  {
  name: 'GDP',
  description: 'Estimate total GDP in millions of dollars',
  property: 'gdp_md_est',
  stops: [
    [0, '#f8d5cc'],
    [1000, '#f4bfb6'],
    [5000, '#f1a8a5'],
    [10000, '#ee8f9a'],
    [50000, '#ec739b'],
    [100000, '#dd5ca8'],
    [250000, '#c44cc0'],
    [5000000, '#9f43d7'],
    [10000000, '#6e40e6']
  ]
},
];
*/

const select = {
  sa2_name: "",
  population: "",
  income: "",
  inequality: "",
  ggp: "",
  jr: "",
  bgi: "",
  sa1_codes: "",
  isDefault: true,
};

const initialState = {
  data,
  options,
  active: options[Constants.MAP_TYPE.GROWTH],
  select,
  mapType: Constants.MAP_TYPE.GROWTH,
  path: window.location.pathname,
  dropdown: "off",
  flowDirection: Constants.FLOW_BI,
  searchBarInfo: [121, -26.5],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.SET_ACTIVE_OPTION:
      return Object.assign({}, state, {
        active: action.option,
      });
    case Constants.SET_SELECT:
      return Object.assign({}, state, {
        select: action.payload,
      });
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
    case "DisplayDefault":
      return {
        ...state,
        select: { ...state.select, isDefault: action.payload },
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
    default:
      return state;
  }
}

export { reducer, initialState };
