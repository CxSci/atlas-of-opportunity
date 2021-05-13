/* eslint-disable no-undef */
import React from "react";
import renderer from "react-test-renderer";
import SASearchField from "../components/SASearchField";
import { preRender } from "./testUtils";
import Enzyme from 'enzyme';
import { resetState } from "../redux/action-creators";
import { store } from "../redux/store";
import { loadFeatures } from "../redux/reducer";
import {loadGeoJSON} from './testUtils';

beforeEach(() => {
  resetState()
  fetchMock.mockIf("SA_dashboard.geojson", loadGeoJSON("./src/data/SA_dashboard.geojson"))
  store.dispatch(loadFeatures())
})

it("renders correctly", async () => {
  const tree = renderer.create(preRender(<SASearchField />, store)).toJSON();
  expect(tree).toMatchSnapshot();
});

it("render dropdown on search input", async () => {
  const event = {target: {value: "ad"}};
  const component = Enzyme.mount(preRender(<SASearchField />, store));
  component.find('input').simulate('mouseEnter').simulate('change', event)
  expect(component.debug()).toMatchSnapshot();

})

it("can select feature", () => {
  const event = {target: {value: "ad"}};
  const component = Enzyme.mount(preRender(<SASearchField />, store));
  component.find('input').simulate('mouseEnter').simulate('change', event)
  console.log(component.debug())
  component.find("#downshift-3-item-0").simulate("click")
  //console.log(component.debug())

})