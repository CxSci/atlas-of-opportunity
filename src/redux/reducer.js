import * as Constants from "../constants";
import data from "../data/SA_dashboard.geojson";

const options = [
  {
    name: "Growth",
    description: "",
    property: "income_diversity",
    stops: [
      [0, "#fdedc4"],
      [0.6, "#f09647"],
      [1.2, "#dd4b27"],
    ],
  },
  {
    name: "Inequality",
    description: "Inequality in time spent",
    property: "inequality",
    stops: [
      [0, "#fdedc4"],
      [40, "#f09647"],
      [60, "#dd4b27"],
    ],
  } /*{
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
}*/,
];

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

const initialState: State = {
  data,
  options,
  active: options[0],
  select,
  modal: true,
  mapType: "growth",
  path: window.location.pathname,
  dropdown: "off",
  flowDirection: Constants.FLOW_BI,
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
    case "Modal":
      return Object.assign({}, state, {
        modal: action.payload,
      });
    case "Header":
      return Object.assign({}, state, {
        path: action.payload,
      });
    case "MapType":
      return {
        ...state,
        mapType: action.payload,
        active: action.payload === "growth" ? options[0] : options[1],
      };
    case "Display":
      console.log("Got display action");
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
    default:
      return state;
  }
}

export { reducer, initialState };
