import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <span>Created by Jeff Craig</span>
        <span className="footer-links">
          <a href="https://twitter.com/jeff_craig_">Twitter</a>
          <a href="http://www.ahltracker.com">AHL Tracker</a>
          <a href="https://jtc-git.github.io/ahl-writeups/">Blog</a>
          <a href="https://public.tableau.com/profile/jeff.craig#!/">Tableau</a>
        </span>
      </div>
    );
  }
}

export default Footer;
