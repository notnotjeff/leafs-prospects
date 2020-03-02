import React, { useState, useEffect } from "react";
import "./Prospects.css";
import firebase from "./firebase.js";
import ProspectTable from "./ProspectTable";
import ProspectFilter from "./ProspectFilter";

function useProspects() {
  const [originalProspects, setOriginalProspects] = useState([])
  
  useEffect(() => {
    const dbProspects = []
    firebase.database()
      .ref("prospects")
      .on("value", snapshot => {
        snapshot.forEach(snap => {
          dbProspects.push(snap.val());
        });
        setOriginalProspects(dbProspects);
      });
  }, [])

  return originalProspects;
}

function useUpdatedAt() {
  const [updatedAt, setUpdatedAt] = useState('');
  
  useEffect(() => {
    firebase.database()
      .ref("prospectsScrapedTime")
      .on("value", snapshot => {
        snapshot.forEach(snap => {
          const time = String(snap.val().updatedAt);
          setUpdatedAt(time)
        });
      });
  }, [])

  return updatedAt;
}

function Prospects() {
  const prospects = useProspects();
  const updatedAt = useUpdatedAt();
  const [filters, setFilters] = useState({
    league: "Any",
    position: "Any",
    shoots: "Any",
    round: "Any",
    draft_year: "Any"
  })

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
  }

  const filterProspects = (initialProspects) => {
    const filterCategories = ["league", "position", "shoots", "round", "draft_year"]
    const fp = initialProspects.filter(p => {
      let fail = false;
      filterCategories.forEach(f => {
        if (f === "round" && filters[f] !== "Any") {
          if (filters[f] === "Undrafted" && p[f] !== undefined) {
            console.log('here')
            fail = true;
          } else if (+p[f] !== +filters[f] && filters[f] !== "Undrafted") {
            fail = true;
          }
        } else if (f === "draft_year" && filters[f] !== "Any") {
          if (filters[f] === "Undrafted" && p[f] !== undefined) {
            fail = true;
          } else if (+p[f] !== +filters[f] && filters[f] !== "Undrafted") {
            fail = true;
          }
        } else if (filters[f] !== p[f] && filters[f] !== "Any") {
          if (f === "position" && filters[f] === "F") {
            if (!["C", "LW", "RW", "W"].includes(p[f])) { fail = true; }
          } else if (f === "position" && filters[f] === "W") {
            if (!["LW", "RW", "W"].includes(p[f])) { fail = true; }
          } else if (f === "position" && filters[f] === "LW") {
            if (p[f] !== "LW" && p[f] !== "W") { fail = true; }
          } else if (f === "position" && filters[f] === "RW") {
            if (p[f] !== "RW" && p[f] !== "W") { fail = true; }
          } else if (f === "league" && filters[f] === "CHL") {
            if (["OHL", "QMJHL", "WHL"].includes(p[f])) { fail = true; }
          } else if (f === "league" && filters[f] === "North American") {
            if (["OHL", "QMJHL", "WHL", "AHL", "ECHL", "USHL", "NCAA"].includes(p[f])) { fail = true; }
          } else if (f === "league" && filters[f] === "European") {
            if (['KHL', 'MHL', 'VHL', 'Liiga', 'SHL', 'Mestis', 'NLA'].includes(p[f])) { fail = true; }
          } else {
            fail = true;
          }
        }
      });
      return fail !== true;
    });

    return fp;
  }

  const filteredProspects = filterProspects(prospects)

  let table = prospects.length === 0 ? (<div className="loading">Collecting data...</div>) :
    (
      <div className="prospects-container">
        <ProspectFilter handleSubmit={handleSubmit} handleChange={handleChange} />
        <ProspectTable prospects={filteredProspects} />
      </div>
    );

  let updatedDiv = <div className="updated-container">Updated at: {updatedAt} EST</div>

  return (
    <section>
      {table}
      {updatedDiv}
    </section>
  );
}

export default Prospects;
