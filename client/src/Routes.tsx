import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Login, Home, Signup } from 'pages';

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  </Switch>
);

export default Routes;

