/* eslint-disable no-undef */
import React from "react";
import renderer from "react-test-renderer";
import SASearchField from "../components/SASearchField";
import geoJson from "../data/SA_dashboard.geojson";
import { preRender } from "./preRender";

it("renders correctly", () => {
  fetchMock.mockResponse(() => geoJson);
  const tree = renderer.create(preRender(<SASearchField />)).toJSON();
  expect(tree).toMatchSnapshot();
});
