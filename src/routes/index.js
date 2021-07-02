import React, { Component } from "react";

import { Switch, Route } from "react-router-dom";

import AboutTheAtlas from "../pages/AboutTheAtlas";
import AboutTheLab from "../pages/AboutTheLab";
import Contributors from "../pages/Contributors";
import Research from "../pages/Research";
import FAQ from "../pages/FAQ";
import Methods from "../pages/Methods";
import Recommendation from "../pages/Recommendation";

const Routes = class Routes extends Component { 

  render() {  

    return (
      <Switch>
        <Route exact path="/aboutTheAtlas" component={AboutTheAtlas} />
        <Route exact path="/aboutTheLab" component={AboutTheLab} />
        <Route exact path="/methods" component={Methods} />
        <Route exact path="/research" component={Research} />
        <Route exact path="/faq" component={FAQ} />
        <Route exact path="/contributors" component={Contributors} />
        <Route exact path="/recommendation" component={Recommendation}/>
      </Switch>
    );
  }
};

export default Routes;
