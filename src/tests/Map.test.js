import React from "react";
import renderer from "react-test-renderer";
import { preRender } from "./preRender";
import Map from "../components/map";

it("renders correctly", () => {
  const tree = renderer.create(preRender(<Map/>)).toJSON();
  expect(tree).toMatchSnapshot();
});
