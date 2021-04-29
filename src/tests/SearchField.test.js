import React from "react";
import renderer from "react-test-renderer";
import SearchField from "../components/SearchField";

const Mock = () => (
  <>
    <SearchField />
  </>
);

it("renders correctly", () => {
  const tree = renderer.create(<Mock />).toJSON();
  expect(tree).toMatchSnapshot();
});
