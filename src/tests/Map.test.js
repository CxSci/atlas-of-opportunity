/* eslint-disable no-undef */
import React from "react";
import renderer from "react-test-renderer";
import { loadGeoJSON, preRender } from "./testUtils";
import Map from "../components/map";
import { resetState } from "../redux/action-creators";
import { store } from "../redux/store";
import { loadFeatures } from "../redux/reducer";

beforeEach(() => {
  resetState()
  fetchMock.mockIf("SA_dashboard.geojson", loadGeoJSON("./src/data/SA_dashboard.geojson"))
  store.dispatch(loadFeatures())
})
it("renders correctly", () => {
  // eslint-disable-next-line no-undef
  const tree = renderer.create(preRender(<Map/>, store)).toJSON();
  expect(tree).toMatchSnapshot();
});
