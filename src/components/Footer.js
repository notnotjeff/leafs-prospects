import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className="Footer">
      <span>
        Created by{' '}
        <a href="https://twitter.com/not_not_jeff" target="_blank" rel="noopener noreferrer">
          Jeff Craig
        </a>
      </span>
      <span className="footer-links">
        <a href="https://twitter.com/leafsaggregator" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href="http://www.ahltracker.com" target="_blank" rel="noopener noreferrer">
          AHL Tracker
        </a>
        <a href="http://www.cwhltracker.com" target="_blank" rel="noopener noreferrer">
          CWHL Tracker
        </a>
        <a href="https://jefftcraig.github.io/ahl-writeups/" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
        <a href="https://public.tableau.com/profile/jeff.craig#!/" target="_blank" rel="noopener noreferrer">
          Tableau
        </a>
      </span>
    </div>
  )
}

export default Footer
