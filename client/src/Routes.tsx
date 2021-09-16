import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Login,
  Home,
  Signup,
  LoginMagic,
  Dashboard
} from 'pages';

// TODO introduce concept of public and private routes
const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/login-magic" component={LoginMagic} />
    <Route path="/signup" component={Signup} />
    <Route path="/dashboard" component={Dashboard} />
  </Switch>
);

export default Routes;

