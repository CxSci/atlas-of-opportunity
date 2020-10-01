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

export function setFlowDirection(direction) {
  store.dispatch({
    type: Constants.SET_FLOW_DIRECTION,
    direction: direction
  });
}
