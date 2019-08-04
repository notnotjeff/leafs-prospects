import React, { Component } from 'react';
import './ProspectFilter.css';
import FilterOption from './FilterOption';

class ProspectFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagues: ["Any", "North American", "European", "AHL", "CHL", "ECHL", "KHL", "Liiga", "Mestis", "MHL", "NCAA", "OHL", "QMJHL", "SHL", "USHL", "VHL", "WHL"],
      positions: ["Any", "F", "D", "W", "LW", "RW", "C"],
      shoots: ["Any", "L", "R"],
      rounds: ["Any", 1, 2, 3, 4, 5, 6, 7, "Undrafted"],
      draft_year: ["Any", 2019, 2018, 2017, 2016, 2015, 2014, "Undrafted"]
    }
  }

  render() {
    const {handleSubmit, handleChange} = this.props;
    return(
      <div className="filter-container">
        <form className="filter" id="skater_form" onSubmit={handleSubmit}>
          <label>
            <span className="label-container">League:</span>
            <FilterOption name="league" options={this.state.leagues} handleChange={handleChange} />
          </label>
          <label>
          <span className="label-container">Position:</span>
            <FilterOption name="position" options={this.state.positions} handleChange={handleChange} />
          </label>
          <label>
          <span className="label-container">Shoots:</span>
            <FilterOption name="shoots" options={this.state.shoots} handleChange={handleChange} />
          </label>
          <label>
          <span className="label-container">Round:</span>
            <FilterOption name="round" options={this.state.rounds} handleChange={handleChange} />
          </label>
          <label>
          <span className="label-container">Draft Year:</span>
            <FilterOption name="draft_year" options={this.state.draft_year} handleChange={handleChange} />
          </label>
        </form>
      </div>
    )
  }
}

export default ProspectFilter;
