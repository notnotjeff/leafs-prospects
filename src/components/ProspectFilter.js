import React from "react";
import "./ProspectFilter.css";
import FilterOption from "./FilterOption";

const ProspectFilter = ({ handleSubmit, handleChange }) => {
  const leagues = [
    "Any",
    "North American",
    "European",
    "AHL",
    "CHL",
    "ECHL",
    "KHL",
    "Liiga",
    "Mestis",
    "MHL",
    "NCAA",
    "NLA",
    "OHL",
    "QMJHL",
    "SHL",
    "USHL",
    "VHL",
    "WHL"
  ]
  const positions = ["Any", "F", "D", "W", "LW", "RW", "C"]
  const shoots = ["Any", "L", "R"]
  const rounds = ["Any", 1, 2, 3, 4, 5, 6, 7, "Undrafted"]
  const draft_year = ["Any", 2019, 2018, 2017, 2016, 2015, "Undrafted"]

  return (
    <div className="filter-container">
      <form className="filter" id="skater_form" onSubmit={handleSubmit}>
        <label>
          <span className="label-container">League:</span>
          <FilterOption
            name="league"
            options={leagues}
            handleChange={handleChange}
          />
        </label>
        <label>
          <span className="label-container">Position:</span>
          <FilterOption
            name="position"
            options={positions}
            handleChange={handleChange}
          />
        </label>
        <label>
          <span className="label-container">Shoots:</span>
          <FilterOption
            name="shoots"
            options={shoots}
            handleChange={handleChange}
          />
        </label>
        <label>
          <span className="label-container">Round:</span>
          <FilterOption
            name="round"
            options={rounds}
            handleChange={handleChange}
          />
        </label>
        <label>
          <span className="label-container">Draft Year:</span>
          <FilterOption
            name="draft_year"
            options={draft_year}
            handleChange={handleChange}
          />
        </label>
      </form>
    </div>
  );
}

export default ProspectFilter;
