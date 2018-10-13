import React, { Component } from 'react';
import './ProspectTable.css';

class ProspectTable extends Component {
  render() {
    const {prospects, categories, sortColumn, sortedColumn} = this.props;
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
              {categories.map((c, i) =>
                <th
                  key={i}
                  title={c.title}
                  className={c.value + ' ' + (sortedColumn === c.value ? 'header-active-col' : '')}
                  onClick={() => { sortColumn(c.value) }}>{c.name}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {prospects.map((p, i) =>
              <tr key={i}>
                <td className={(sortedColumn === "last_name" ? 'active-col' : '')}><a href={p.ep_url} target="_blank" rel="noopener noreferrer">{p.first_name} {p.last_name}</a></td>
                <td className={(sortedColumn === "league" ? 'active-col' : '')}>{p.league}</td>
                <td className={(sortedColumn === "position" ? 'active-col' : '')}>{p.position}</td>
                <td className={(sortedColumn === "shoots" ? 'active-col' : '')}>{p.shoots}</td>
                <td className={(sortedColumn === "age" ? 'active-col' : '')}>{p.age}</td>
                <td className={(sortedColumn === "draft_year" ? 'active-col' : '')}>{p.draft_year}</td>
                <td className={(sortedColumn === "round" ? 'active-col' : '')}>{p.round}</td>
                <td className={(sortedColumn === "pick" ? 'active-col' : '')}>{p.pick}</td>
                <td className={(sortedColumn === "games_played" ? 'active-col' : '')}>{p.games_played}</td>
                <td className={(sortedColumn === "goals" ? 'active-col' : '')}>{p.goals}</td>
                <td className={(sortedColumn === "assists" ? 'active-col' : '')}>{p.assists}</td>
                <td className={(sortedColumn === "points" ? 'active-col' : '')}>{p.points}</td>
                <td className={(sortedColumn === "shots" ? 'active-col' : '')}>{p.shots}</td>
                <td className={(sortedColumn === "goals_pg" ? 'active-col' : '')}>{p.goals_pg}</td>
                <td className={(sortedColumn === "assists_pg" ? 'active-col' : '')}>{p.assists_pg}</td>
                <td className={(sortedColumn === "points_pg" ? 'active-col' : '')}>{p.points_pg}</td>
                <td className={(sortedColumn === "shots_pg" ? 'active-col' : '')}>{p.shots_pg}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProspectTable;
