import React from 'react'
import './ProspectFilters.css'
import Filter from './Filter'
import { leagues, positions, shoots, rounds, draft_years } from 'constants/filter-options'

const ProspectFilters = ({ handleChange }) => {
  return (
    <div className="filter-container">
      <form className="filter" id="skater_form" onSubmit={e => e.preventDefault()}>
        <Filter name="league" label="League:" options={leagues} handleChange={handleChange} />
        <Filter name="position" label="Position:" options={positions} handleChange={handleChange} />
        <Filter name="shoots" label="Shoots:" options={shoots} handleChange={handleChange} />
        <Filter name="draft_round" label="Round:" options={rounds} handleChange={handleChange} />
        <Filter name="draft_year" label="Draft Year:" options={draft_years} handleChange={handleChange} />
      </form>
    </div>
  )
}

export default ProspectFilters
