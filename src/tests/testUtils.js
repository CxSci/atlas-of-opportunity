import { Provider } from "react-redux";
import React from "react";

const fs = require("fs");

export const preRender = (element, store) => (
  <Provider store={store}>{element}</Provider>
);

export const loadGeoJSON = (path) => {
    // eslint-disable-next-line no-unused-vars
    return fs.readFileSync(path).toString()
}