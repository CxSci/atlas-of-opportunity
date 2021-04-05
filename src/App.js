import React, { Component } from "react";
import { connect } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";
import Routes from "./routes/index";

import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Header />
          <Routes />
        </Provider>
      </BrowserRouter>
    );
  }
import "./css/App.css"
};

export default connect()(App);
