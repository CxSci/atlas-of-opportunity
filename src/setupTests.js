// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
require("jest-fetch-mock").enableMocks();

configure({ adapter: new Adapter() });

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    GeolocateControl: jest.fn(),
    Map: jest.fn(() => ({
      addControl: jest.fn(),
      on: jest.fn(),
      remove: jest.fn(),
      resize: jest.fn()
    })),
    NavigationControl: jest.fn(),
    Popup: jest.fn()
}));