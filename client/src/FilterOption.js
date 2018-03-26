import React from 'react';
import './FilterOption.css';

const FilterOption = props => {
  const { name, handleChange } = props;
  let options = props.options.map((o, i) => (
    <option key={i} value={o}>{o}</option>
  ));
  return(
    <select name={name} onChange={handleChange}>
      {options}
    </select>
  );
}

export default FilterOption;
