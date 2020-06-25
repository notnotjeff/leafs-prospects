import React, { useState, useMemo } from 'react'
import { sortProspects, selectColumn } from 'utils/sort-prospects'
import { sortCategories } from 'constants/sort-categories'
import './ProspectTable.css'

const ProspectTable = ({ prospects }) => {
  const [sortColumn, setSortColumn] = useState('points_pg')
  const [sortDirection, setSortDirection] = useState('desc')
  const sortedProspects = useMemo(() => sortProspects(prospects, sortColumn, sortDirection), [prospects, sortColumn, sortDirection])

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
            {sortCategories.map((c, i) => (
              <th
                key={i}
                title={c.title}
                className={`${c.value} ${sortColumn === c.value ? 'header-active-col' : ''}`}
                onClick={() => {
                  selectColumn(sortColumn, sortDirection, c.value, setSortColumn, setSortDirection)
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
              <td className={sortColumn === 'last_name' ? 'active-col' : ''}>
                <a href={p.ep_url} target="_blank" rel="noopener noreferrer">
                  {p.first_name} {p.last_name}
                </a>
              </td>
              <td className={sortColumn === 'league' ? 'active-col' : ''}>{p.league}</td>
              <td className={sortColumn === 'position' ? 'active-col' : ''}>{p.position}</td>
              <td className={sortColumn === 'shoots' ? 'active-col' : ''}>{p.shoots}</td>
              <td className={sortColumn === 'age' ? 'active-col' : ''}>{Number(p.age).toFixed(1)}</td>
              <td className={sortColumn === 'draft_year' ? 'active-col' : ''}>{p.draft_year}</td>
              <td className={sortColumn === 'draft_round' ? 'active-col' : ''}>{p.draft_round}</td>
              <td className={sortColumn === 'draft_pick' ? 'active-col' : ''}>{p.draft_pick}</td>
              <td className={sortColumn === 'games_played' ? 'active-col' : ''}>{p.games_played}</td>
              <td className={sortColumn === 'goals' ? 'active-col' : ''}>{p.goals}</td>
              <td className={sortColumn === 'assists' ? 'active-col' : ''}>{p.assists}</td>
              <td className={sortColumn === 'points' ? 'active-col' : ''}>{p.points}</td>
              <td className={sortColumn === 'shots' ? 'active-col' : ''}>{p.shots}</td>
              <td className={sortColumn === 'goals_pg' ? 'active-col' : ''}>{p.goals_pg}</td>
              <td className={sortColumn === 'assists_pg' ? 'active-col' : ''}>{p.assists_pg}</td>
              <td className={sortColumn === 'points_pg' ? 'active-col' : ''}>{p.points_pg}</td>
              <td className={sortColumn === 'shots_pg' ? 'active-col' : ''}>{p.shots_pg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProspectTable
