import { Provider } from "react-redux";
import { store } from "../redux/store";
import React from "react";
export const preRender = (element) => (
  <Provider store={store}>{element}</Provider>
);
