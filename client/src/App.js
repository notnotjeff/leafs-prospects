import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Footer from './Footer';
import Prospects from './Prospects';
import Games from './Games';
import Navigation from './Navigation';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Toronto Maple Leafs Prospect Aggregator</h1>
        <BrowserRouter>
          <div>
            <Navigation />
            <Switch>
              <Route path='/prospects' component={Prospects} />
              <Route path='/games' component={Games} />
              <Redirect to="/prospects" />
            </Switch>
          </div>
        </BrowserRouter>
        <Footer />
      </div>
    );
  }
}

export default App;
