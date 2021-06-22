import React, { Component } from "react";

import { Switch, Route } from "react-router-dom";

import About from "../pages/about";
import Research from "../pages/research";
import FAQ from "../pages/faq";
import Methods from "../pages/methods";
import Recommendation from "../pages/recommendation";

const Routes = class Routes extends Component { 

  render() {  

    return (
      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/methods" component={Methods} />
        <Route exact path="/research" component={Research} />
        <Route exact path="/faq" component={FAQ} />
        <Route exact path="/recommendation" component={Recommendation}/>
      </Switch>
    );
  }
};

export default Routes;
