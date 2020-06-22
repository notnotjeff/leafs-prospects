import React from 'react'
import './Filter.css'

const Filter = ({ name, label, options, handleChange }) => {
  return (
    <label htmlFor={name}>
      {label}
      <select name={name} onChange={handleChange}>
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Filter
