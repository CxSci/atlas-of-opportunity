import React, { Component } from "react";

import { Switch, Route } from "react-router-dom";

import Main from "../pages/main";
import About from "../pages/about";
import Research from "../pages/research";
import FAQ from "../pages/faq";
import Methods from "../pages/methods";
import Segregation from "../pages/segregation";

const Routes = class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/segregation" component={Segregation} />
        <Route exact path="/about" component={About} />
        <Route exact path="/methods" component={Methods} />
        <Route exact path="/research" component={Research} />
        <Route exact path="/faq" component={FAQ} />
      </Switch>
    );
  }
};

export default Routes;
