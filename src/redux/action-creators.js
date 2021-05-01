import { store } from "./store";
import * as Constants from "../constants";

export function setActiveOption(option) {
  store.dispatch({
    type: Constants.SET_ACTIVE_OPTION,
    option,
  });
}

export function setSelect(payload) {
  store.dispatch({
    type: Constants.SET_SELECT,
    payload: payload,
  });
}

export function setModal() {
  store.dispatch({
    type: "Modal",
    payload: false,
  });
}

export function setShowWelcomeDialog(payload) {
  store.dispatch({
    type: Constants.SHOW_WELCOME_DIALOG,
    payload: payload,
  });
}

export function setDisplayDefault() {
  store.dispatch({
    type: "DisplayDefault",
    payload: true,
  });
}

export function setHeaderOption(payload) {
  store.dispatch({
    type: "Header",
    payload: payload,
  });
}

export function setDropDown(payload) {
  store.dispatch({
    type: "DropDown",
    payload: payload,
  });
}

export function setMapType(payload) {
  store.dispatch({
    type: "MapType",
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

export function setSideBar(payload) {
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
