import React, { useState } from "react";
import "./ProspectTable.css";

function ProspectTable({ prospects }) {
  const sortProspects = (p) => {
    p.sort((a, b) => {
      if (sortDirection === "desc") {
        // Sort null values to the bottom
        if (a[sortColumn] == null) return 1;
        if (b[sortColumn] == null) return -1;
  
        if (a[sortColumn] > b[sortColumn]) return -1;
        if (a[sortColumn] < b[sortColumn]) return 1;
      } else {
        // Sort null values to the bottom
        if (a[sortColumn] == null) return 1;
        if (b[sortColumn] == null) return -1;
  
        if (a[sortColumn] < b[sortColumn]) return -1;
        if (a[sortColumn] > b[sortColumn]) return 1;
      }
      return 0;
    })

    return p
  }

  const [sortColumn, setSortColumn] = useState('points_pg')
  const [sortDirection, setSortDirection] = useState('desc')
  const sortedProspects = sortProspects(prospects)

  const categories = [
    { name: "Name", value: "last_name", title: "Name" },
    { name: "League", value: "league", title: "League" },
    { name: "POS", value: "position", title: "Position" },
    { name: "H", value: "shoots", title: "Handedness" },
    { name: "Age", value: "age", title: "Age" },
    { name: "DY", value: "draft_year", title: "Draft Year" },
    { name: "RD", value: "draft_round", title: "Draft Round" },
    { name: "Pick", value: "draft_pick", title: "Overall Pick Number" },
    { name: "GP", value: "games_played", title: "Games Played" },
    { name: "G", value: "goals", title: "Goals" },
    { name: "A", value: "assists", title: "Assists" },
    { name: "P", value: "points", title: "Points" },
    { name: "S", value: "shots", title: "Shots" },
    { name: "G/G", value: "goals_pg", title: "Goals per Game" },
    { name: "A/G", value: "assists_pg", title: "Assists per Game" },
    { name: "P/G", value: "points_pg", title: "Points per Game" },
    { name: "S/G", value: "shots_pg", title: "Shots per Game" }
  ]

  const startAscendingColumns = [
    "last_name",
    "league",
    "position",
    "shoots",
    "draft_round",
    "draft_pick"
  ]

  const selectColumn = (columnName) => {
    // If Column Already Selected Reverse Direction
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    }
    // If Column Is Newly Selected Sort Direction Based On Column Type
    else if (sortColumn !== columnName) {
      setSortDirection(startAscendingColumns.includes(columnName) ? 'asc' : 'desc')
      setSortColumn(columnName)
    }
    // If Something Breaks Just Set Sort To Last Name By Default
    else {
      setSortColumn("last_name")
      setSortDirection("asc")
    }
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th colSpan="1" className="last_name"></th>
            <th colSpan="7">Bio</th>
            <th colSpan="5">Stats</th>
            <th colSpan="4">Rates</th>
          </tr>

          <tr className="categories">
            {categories.map((c, i) => (
              <th
                key={i}
                title={c.title}
                className={
                  c.value +
                  " " +
                  (sortColumn === c.value ? "header-active-col" : "")
                }
                onClick={() => {
                  selectColumn(c.value);
                }}
              >
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedProspects.map((p, i) => (
            <tr key={i}>
              <td
                className={sortColumn === "last_name" ? "active-col" : ""}
              >
                <a href={p.ep_url} target="_blank" rel="noopener noreferrer">
                  {p.first_name} {p.last_name}
                </a>
              </td>
              <td className={sortColumn === "league" ? "active-col" : ""}>
                {p.league}
              </td>
              <td className={sortColumn === "position" ? "active-col" : ""}>
                {p.position}
              </td>
              <td className={sortColumn === "shoots" ? "active-col" : ""}>
                {p.shoots}
              </td>
              <td className={sortColumn === "age" ? "active-col" : ""}>
                {p.age}
              </td>
              <td
                className={sortColumn === "draft_year" ? "active-col" : ""}
              >
                {p.draft_year}
              </td>
              <td className={sortColumn === "draft_round" ? "active-col" : ""}>
                {p.draft_round}
              </td>
              <td className={sortColumn === "draft_pick" ? "active-col" : ""}>
                {p.draft_pick}
              </td>
              <td
                className={
                  sortColumn === "games_played" ? "active-col" : ""
                }
              >
                {p.games_played}
              </td>
              <td className={sortColumn === "goals" ? "active-col" : ""}>
                {p.goals}
              </td>
              <td className={sortColumn === "assists" ? "active-col" : ""}>
                {p.assists}
              </td>
              <td className={sortColumn === "points" ? "active-col" : ""}>
                {p.points}
              </td>
              <td className={sortColumn === "shots" ? "active-col" : ""}>
                {p.shots}
              </td>
              <td className={sortColumn === "goals_pg" ? "active-col" : ""}>
                {p.goals_pg}
              </td>
              <td
                className={sortColumn === "assists_pg" ? "active-col" : ""}
              >
                {p.assists_pg}
              </td>
              <td
                className={sortColumn === "points_pg" ? "active-col" : ""}
              >
                {p.points_pg}
              </td>
              <td className={sortColumn === "shots_pg" ? "active-col" : ""}>
                {p.shots_pg}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProspectTable;
