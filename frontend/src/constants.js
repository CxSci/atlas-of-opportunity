export const HIDE_SIDEBAR_DIALOG = "HIDE_SIDEBAR_DIALOG";
export const SET_ACTIVE_MAP_LAYER = "SET_ACTIVE_MAP_LAYER";
export const SET_FLOW_DIRECTION = "SET_FLOW_DIRECTION";
export const SET_SEARCH_BAR_INFO = "SET_SEARCH_BAR_INFO";
export const SET_SIDEBAR = "SET_SIDEBAR";
export const CLICKEDSA2 = "CLICKEDSA2";
export const CLICKEDFEATURES = "CLICKEDFEATURES";
export const GEOCODER = "GEOCODER";
export const SET_SELECTED_FEATURE = "SET_SELECTED_FEATURE";
export const SET_HIGHLIGHTED_FEATURE = "SET_HIGHLIGHTED_FEATURE";
export const ADD_COMPARISON_FEATURE = "ADD_COMPARISON_FEATURE";
export const REMOVE_COMPARISON_FEATURE = "REMOVE_COMPARISON_FEATURE";
export const UPDATE_COLLAPSIBLE_STATE = "UPDATE_COLLAPSIBLE_STATE";
export const SET_HAMBURGER_MENU_OPEN = "SET_HAMBURGER_MENU_OPEN";
export const SET_COMPARISON_TYPE = "SET_COMPARISON_TYPE";
export const SET_SAVED_MAP_POSITION = "SET_SAVED_MAP_POSITION";

export const MAP_TYPE = {
  GROWTH: "growth",
  TRANSACTIONS: "transactions",
  SEGREGATION: "segregation",
  BUSINESSES: "businesses"
};

export const COMPARISON_TYPE = {
  TABLE: "table",
  GRID: "grid",
};

export const FLOW_IN = "inflow";
export const FLOW_OUT = "outflow";
export const FLOW_BI = "bidirectional";
export const RECOMMENDATION_DUMMY_DATA = [
  {
    title: "Your Business",
    description: "We will ask you a few questions about your business needs, and then provide location recommendations based on your answers.",
    questions: [
      {
        type: "typeahead_select",
        question: "What kind of business are you looking to open?",
        key: "anzsic_code",
        answers: [], // Populated from anzsic_code.json in RecommendationTool
      },
      {
        type: "slider_single",
        question: "How many people do you expect to employ, roughly?",
        key: "employee_count",
        answers: {
          0: "0",
          20: "5",
          40: "20",
          60: "50",
          80: "100",
          100: "200+"
        }
      },
    ]
  },
  {
    title: "Your Customers",
    description: "",
    questions: [
      {
        type: "slider_range",
        question: "What is the income range of the customers you would like to reach?",
        key: "customer_income",
        answers: {
          0: "$0",
          20: "$25K",
          40: "$50K",
          60: "$75K",
          80: "$100K",
          100: "$250K+",
        },
        values: {
          0: 0,
          20: 25_000,
          40: 50_000,
          60: 75_000,
          80: 100_000,
          100: 250_000,
        }
      },
    ]
  },
  {
    title: "Premises",
    description: "",
    questions: [
      {
        type: "slider_single",
        question: "What is the most you are willing to pay to lease your commercial premises?",
        key: "commercial_premises",
        answers: {
          0: "$0",
          11: "$5K",
          22: "$10K",
          33: "$20K",
          44: "$30K",
          55: "$40K",
          66: "$50K",
          77: "$100K",
          88: "$200K",
          100: "$500K+"
        },
        values: {
          0: 0,
          11: 5_000,
          22: 10_000,
          33: 20_000,
          44: 30_000,
          55: 40_000,
          66: 50_000,
          77: 100_000,
          88: 200_000,
          100: 500_000,
        }
      },
    ]
  }
]