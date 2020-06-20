import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { ReactQueryDevtools } from "react-query-devtools";
import "./App.css";
import Footer from "./Footer";
import Prospects from "./Prospects";
import Games from "./Games";
import Navigation from "./Navigation";

const App = () => {
  return (
    <div className="App">
      <h1>Toronto Maple Leafs Prospect Aggregator</h1>
      <Router>
        <div className="content-container">
          <Navigation />
          <Switch>
            <Route path="/" component={Prospects} exact />
            <Route path="/games" component={Games} />
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
      <Footer />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
