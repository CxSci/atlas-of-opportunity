import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";

{/* change so App has Main (rather than Routes) */}
import Main from "./pages/main";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./css/App.css"

const App = (props) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className={(props.sidebarOpen && props.selectedFeature)
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
  selectedFeature: PropTypes.object,
  sidebarOpen: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedFeature: state.selectedFeature,
    sidebarOpen: state.sidebarOpen,
  };
}

export default connect(mapStateToProps)(App);
