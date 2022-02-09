import { store } from "./store";
import * as Constants from "../constants";

export function hideSidebarDialog(payload) {
  store.dispatch({
    type: Constants.HIDE_SIDEBAR_DIALOG,
    payload: payload,
  });
}

export function setHamburgerMenuOpen(payload) {
  store.dispatch({
    type: Constants.SET_HAMBURGER_MENU_OPEN,
    payload: payload,
  });
}

export function setMapType(payload) {
  store.dispatch({
    type: Constants.SET_ACTIVE_MAP_LAYER,
    payload: payload,
  });
}

export function setFlowDirection(direction) {
  store.dispatch({
    type: Constants.SET_FLOW_DIRECTION,
    direction: direction,
  });
}

export function setSearchBarInfo(payload) {
  store.dispatch({
    type: Constants.SET_SEARCH_BAR_INFO,
    payload: payload,
  });
}

export function setSidebar(payload) {
  store.dispatch({
    type: Constants.SET_SIDEBAR,
    payload: payload,
  });
}

export function setSelectedFeature(feature) {
  store.dispatch({
    type: Constants.SET_SELECTED_FEATURE,
    feature: feature,
  })
}

export function setHighlightedFeature(feature) {
  store.dispatch({
    type: Constants.SET_HIGHLIGHTED_FEATURE,
    feature: feature,
  })
}

export function addComparisonFeature(feature) {
  store.dispatch({
    type: Constants.ADD_COMPARISON_FEATURE,
    feature
  })
}

export function removeComparisonFeature(feature) {
  store.dispatch({
    type: Constants.REMOVE_COMPARISON_FEATURE,
    feature
  })
}

export function updateCollapsibleState(state) {
  store.dispatch({
    type: Constants.UPDATE_COLLAPSIBLE_STATE,
    payload: state
  })
}

export function setComparisonType(state) {
  store.dispatch({
    type: Constants.SET_COMPARISON_TYPE,
    payload: state
  })
}

export function setSavedMapPosition(state) {
  store.dispatch({
    type: Constants.SET_SAVED_MAP_POSITION,
    payload: state,
  })
}
