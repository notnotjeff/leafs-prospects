import React, { useState } from "react";
import { useQuery } from "react-query";
import "./Prospects.css";
import ProspectTable from "./ProspectTable";
import ProspectFilter from "./ProspectFilter";
import { filterProspects } from "utils/filter-prospects";

const fetchProspects = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/prospects`);
  const { data } = await response.json();

  return data;
}

function Prospects() {
  const { status, data } = useQuery('prospects', fetchProspects);
  const updatedAt = data?.[0]?.updated_at ? new Date(Date.parse(String(data?.[0]?.updated_at))).toLocaleString() : null;
  const [filters, setFilters] = useState({
    league: "Any",
    position: "Any",
    shoots: "Any",
    draft_round: "Any",
    draft_year: "Any"
  })

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
  }

  const filteredProspects = filterProspects(data, filters)

  if (status === 'loading') { return <div className="loading">Collecting data...</div>; }
  if (status === 'error') { return <div className="loading">Unable to load data!</div>; }

  return (
    <section>
      <div className="prospects-container">
        <ProspectFilter handleSubmit={handleSubmit} handleChange={handleChange} />
        <ProspectTable prospects={filteredProspects} />
      </div>
      <div className="updated-container">Updated at: {updatedAt}</div>
    </section>
  );
}

export default Prospects;
