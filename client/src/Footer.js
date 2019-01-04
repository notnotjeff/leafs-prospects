import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <span>Created by Jeff Craig</span>
        <span className="footer-links">
          <a href="https://twitter.com/jeff_craig_" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="http://www.ahltracker.com" target="_blank" rel="noopener noreferrer">AHL Tracker</a>
          <a href="http://www.cwhltracker.com" target="_blank" rel="noopener noreferrer">CWHL Tracker</a>
          <a href="https://jefftcraig-git.github.io/ahl-writeups/" target="_blank" rel="noopener noreferrer">Blog</a>
          <a href="https://public.tableau.com/profile/jeff.craig#!/" target="_blank" rel="noopener noreferrer">Tableau</a>
        </span>
      </div>
    );
  }
}

export default Footer;
