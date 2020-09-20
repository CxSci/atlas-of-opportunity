import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";
import Routes from "./routes/index";

import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = class App extends Component {
  static propTypes = {
    modal: PropTypes.string.isRequired,
  };
  render() {
    const { modal } = this.props;
    return (
      <BrowserRouter>
        <Provider store={store}>
          {!modal && <Header />}
          <Routes />
        </Provider>
      </BrowserRouter>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps)(App);
