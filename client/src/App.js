import React, { Component } from 'react';
import './App.css';
import Footer from './Footer';
import Prospects from './Prospects';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Toronto Maple Leafs Prospect Aggregator</h1>
        <Prospects />
        <Footer />
      </div>
    );
  }
}

export default App;
