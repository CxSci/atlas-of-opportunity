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
