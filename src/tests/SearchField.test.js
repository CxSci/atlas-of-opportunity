/* eslint-disable no-undef */
import React from "react";
import renderer from "react-test-renderer";
import SASearchField from "../components/SASearchField";
import { loadGeoJSON, preRender } from "./testUtils";
import Enzyme from 'enzyme';

beforeEach(() => {
  fetchMock.mockResponse(loadGeoJSON("./src/data/SA_dashboard.geojson"));
})

it("renders correctly", () => {
  const tree = renderer.create(preRender(<SASearchField />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it("can select feature", () => {
  const onSearchMock = jest.fn();
  const event = "feature";
  const component = Enzyme.mount(preRender(<SASearchField setSelectedFeature={onSearchMock} />));
  component.find('input').simulate('change', event);
  expect(onSearchMock).toBeCalledWith('feature');
})
