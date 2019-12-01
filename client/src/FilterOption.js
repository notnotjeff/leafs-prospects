import React from "react";
import "./FilterOption.css";

const FilterOption = passedProps => {
  const { name, handleChange } = passedProps;
  let options = passedProps.options.map((o, i) => (
    <option key={i} value={o}>
      {o}
    </option>
  ));
  return (
    <select name={name} onChange={handleChange}>
      {options}
    </select>
  );
};

export default FilterOption;
