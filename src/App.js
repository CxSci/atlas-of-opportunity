import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import Header from "./components/header";
import Main from "./pages/main";

import "./css/App.css"

const App = (props) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className={(props.sidebarOpen && (props.selectedFeature || props.comparisonFeatures))
          ? "sidebarOpen"
          : "sidebarClosed"}>
          <Header/>
          <Main/> 
        </div>
      </Provider>
    </BrowserRouter>
  );
};

App.propTypes = {
  comparisonFeatures: PropTypes.arrayOf(PropTypes.object),
  selectedFeature: PropTypes.object,
  sidebarOpen: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    comparisonFeatures: state.comparisonFeatures,
    selectedFeature: state.selectedFeature,
    sidebarOpen: state.sidebarOpen,
  };
}

export default connect(mapStateToProps)(App);
