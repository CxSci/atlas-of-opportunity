import React from "react";
import { connect } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";
import Routes from "./routes/index";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./css/App.css"

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Header />
        <Routes />
      </Provider>
    </BrowserRouter>
  );
};

export default connect()(App);
