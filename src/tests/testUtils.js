import { Provider } from "react-redux";
import { store } from "../redux/store";
import React from "react";

const fs = require("fs");

export const preRender = (element) => (
  <Provider store={store}>{element}</Provider>
);

export const loadGeoJSON = (path) => {
    // eslint-disable-next-line no-unused-vars
    return fs.readFileSync(path).toString()
}