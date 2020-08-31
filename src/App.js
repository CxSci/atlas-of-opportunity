import React, { Component } from "react";

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
};

export default App;
