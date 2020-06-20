import React, { useState } from "react";
import "./Prospects.css";
import ProspectTable from "./ProspectTable";
import ProspectFilter from "./ProspectFilter";
import { filterProspects } from "utils/filter-prospects";
import { useProspects } from "queries/prospects";

const Prospects = () => {
  const { status, data } = useProspects();
  const [filters, setFilters] = useState({
    league: "Any",
    position: "Any",
    shoots: "Any",
    draft_round: "Any",
    draft_year: "Any"
  })

  if (status === 'loading') { return <div className="loading">Collecting data...</div>; }
  if (status === 'error') { return <div className="loading">Unable to load data!</div>; }

  const updatedAt = data?.[0]?.updated_at ? new Date(Date.parse(String(data?.[0]?.updated_at))).toLocaleString() : null;

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
  }

  const filteredProspects = filterProspects(data, filters)

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
