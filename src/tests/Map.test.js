import React from "react";
import renderer from "react-test-renderer";
//import Map from "../components/map";

it("renders correctly", () => {
  const tree = renderer.create(<></>).toJSON();
  expect(tree).toMatchSnapshot();
});
