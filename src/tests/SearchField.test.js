import React from "react";
import renderer from "react-test-renderer";
import SASearchField from "../components/SASearchField";

it("renders correctly", () => {
  jest.spyOn(window, "fetch").mockImplementationOnce((x) => {
    return Promise.resolve({
      json: () => Promise.resolve(x),
    });
  });
  const tree = renderer.create(<SASearchField />).toJSON();
  expect(tree).toMatchSnapshot();
});
