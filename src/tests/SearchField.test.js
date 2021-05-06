/* eslint-disable no-undef */
import React from "react";
import renderer from "react-test-renderer";
import SASearchField from "../components/SASearchField";
import { preRender } from "./testUtils";
import Enzyme from 'enzyme';

beforeEach(() => {
  //fetchMock.mockResponse(JSON.stringify(JSON.parse(loadGeoJSON("./src/data/SA_dashboard.geojson"))));
  //fetch.mockResponseOnce(loadGeoJSON("./src/data/SA_dashboard.geojson"))

})

it("renders correctly", async () => {
  const tree = renderer.create(preRender(<SASearchField />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it("can select feature", () => {
  //console.log(JSON.parse(loadGeoJSON("./src/data/SA_dashboard.geojson")))
  //fetch.mockResponseOnce(loadGeoJSON("./src/data/SA_dashboard.geojson"))
  //fetch.mockResponse(JSON.stringify({ access_token: '12345' }))
  const event = {target: {value: "ad"}};
  const component = Enzyme.mount(preRender(<SASearchField />));
  component.find('input').simulate('mouseEnter').simulate('change', event)
  console.log(component.debug())
  //console.log(component.find("#downshift-1-toggle-button").simulate("click").find("#downshift-1-item-0").simulate("click").debug())
  //component.find("#downshift-1-item-0").simulate("click")
})