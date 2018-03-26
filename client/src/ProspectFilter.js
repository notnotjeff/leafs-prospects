import React, { Component } from 'react';
import './ProspectFilter.css';
import FilterOption from './FilterOption';

class ProspectFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagues: ["Any", "AHL", "CHL", "ECHL", "KHL", "Liiga", "MHL", "NCAA", "OHL", "QMJHL", "SHL", "VHL", "WHL"],
      positions: ["Any", "F", "D", "W", "LW", "RW", "C"],
      shoots: ["Any", "L", "R"]
    }
  }

  render() {
    const {handleSubmit, handleChange} = this.props;
    return(
      <form className="filter" id="skater_form" onSubmit={handleSubmit}>
        <label>
          League:
          <FilterOption name="league" options={this.state.leagues} handleChange={handleChange} />
        </label>
        <label>
          Position:
          <FilterOption name="position" options={this.state.positions} handleChange={handleChange} />
        </label>
        <label>
          Shoots:
          <FilterOption name="shoots" options={this.state.shoots} handleChange={handleChange} />
        </label>
      </form>
    )
  }
}

export default ProspectFilter;
