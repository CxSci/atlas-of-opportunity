import React from "react";
import renderer from "react-test-renderer";
import { loadGeoJSON, preRender } from "./testUtils";
import Map from "../components/map";

it("renders correctly", () => {
  // eslint-disable-next-line no-undef
  fetchMock.mockResponse(loadGeoJSON("./src/data/SA_dashboard.geojson"));
  const tree = renderer.create(preRender(<Map/>)).toJSON();
  expect(tree).toMatchSnapshot();
});
