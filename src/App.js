import React from "react";
import { connect } from "react-redux";

import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";

{/* change so App has Main (rather than Routes) */}
import Main from "./pages/main";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./css/App.css"

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Header />
        {/* change so App has Main */}
        <Main /> 
      </Provider>
    </BrowserRouter>
  );
};

export default connect()(App);
