import React, { Component } from "react";

import { Switch, Route } from "react-router-dom";

import Main from "../pages/main";
import Methods from "../pages/methods";
import Project from "../pages/project";
import About from "../pages/about";
import Research from "../pages/research";
import Contact from "../pages/contact";

const Routes = class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/methods" component={Methods} />
        <Route exact path="/project" component={Project} />
        <Route exact path="/about" component={About} />
        <Route exact path="/research" component={Research} />
        <Route exact path="/contact" component={Contact} />
      </Switch>
    );
  }
};

export default Routes;
