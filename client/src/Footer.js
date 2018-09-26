import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <span>Created by Jeff Craig</span>
        <span className="footer-links">
          <a href="https://twitter.com/jeff_craig_" target="_blank">Twitter</a>
          <a href="http://www.ahltracker.com" target="_blank">AHL Tracker</a>
          <a href="http://www.cwhltracker.com" target="_blank">CWHL Tracker</a>
          <a href="https://jtc-git.github.io/ahl-writeups/" target="_blank">Blog</a>
          <a href="https://public.tableau.com/profile/jeff.craig#!/" target="_blank">Tableau</a>
        </span>
      </div>
    );
  }
}

export default Footer;
