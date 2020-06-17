import React from 'react';

import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

import './App.css'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/chat" component={Chat} />
      </Switch>
    </Router>
  );
}

export default App;
