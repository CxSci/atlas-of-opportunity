import React, { Component } from "react";

import { Switch, Route } from "react-router-dom";

import About from "../pages/about";
import Research from "../pages/research";
import FAQ from "../pages/faq";
import Methods from "../pages/methods";

const Routes = class Routes extends Component { 

  render() {  

    return (
      <div> 
      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/methods" component={Methods} />
        <Route exact path="/research" component={Research} />
        <Route exact path="/faq" component={FAQ} />
      </Switch>
      </div> 
    );
  }
};

export default Routes;
