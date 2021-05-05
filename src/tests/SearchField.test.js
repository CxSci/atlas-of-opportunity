/* eslint-disable no-undef */
import React from "react";
import renderer from "react-test-renderer";
import SASearchField from "../components/SASearchField";
import { loadGeoJSON, preRender } from "./testUtils";
import Enzyme from 'enzyme';

beforeEach(() => {
  fetchMock.mockResponse(loadGeoJSON("./src/data/SA_dashboard.geojson"));
})

it("renders correctly", async () => {
  const tree = renderer.create(preRender(<SASearchField />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it("can select feature", () => {
  const onSearchMock = jest.fn();
  const event = {target: {value: "ad"}};
  const component = Enzyme.mount(preRender(<SASearchField setSelectedFeature={onSearchMock} />));
  //console.log(component.debug())
  //component.find('input').simulate('mouseEnter').simulate('change', event)
  console.log(component.find("#downshift-1-toggle-button").simulate("click").find("#downshift-1-item-0").simulate("click").debug())
  console.log(component.debug())
  //component.find("#downshift-1-item-0").simulate("click")
  expect(onSearchMock).toBeCalledWith('test');
})