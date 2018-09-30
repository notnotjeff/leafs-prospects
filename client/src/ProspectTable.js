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
                  className={c.value + ' ' + (sortedColumn === c.value ? 'active' : '')}
                  onClick={() => { sortColumn(c.value) }}>{c.name}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {prospects.map((p, i) =>
              <tr key={i}>
                <td className={(sortedColumn === "last_name" ? 'active' : '')}><a href={p.ep_url} target="_blank" rel="noopener noreferrer">{p.first_name} {p.last_name}</a></td>
                <td className={(sortedColumn === "league" ? 'active' : '')}>{p.league}</td>
                <td className={(sortedColumn === "position" ? 'active' : '')}>{p.position}</td>
                <td className={(sortedColumn === "shoots" ? 'active' : '')}>{p.shoots}</td>
                <td className={(sortedColumn === "age" ? 'active' : '')}>{p.age}</td>
                <td className={(sortedColumn === "draft_year" ? 'active' : '')}>{p.draft_year}</td>
                <td className={(sortedColumn === "round" ? 'active' : '')}>{p.round}</td>
                <td className={(sortedColumn === "pick" ? 'active' : '')}>{p.pick}</td>
                <td className={(sortedColumn === "games_played" ? 'active' : '')}>{p.games_played}</td>
                <td className={(sortedColumn === "goals" ? 'active' : '')}>{p.goals}</td>
                <td className={(sortedColumn === "assists" ? 'active' : '')}>{p.assists}</td>
                <td className={(sortedColumn === "points" ? 'active' : '')}>{p.points}</td>
                <td className={(sortedColumn === "shots" ? 'active' : '')}>{p.shots}</td>
                <td className={(sortedColumn === "goals_pg" ? 'active' : '')}>{p.goals_pg}</td>
                <td className={(sortedColumn === "assists_pg" ? 'active' : '')}>{p.assists_pg}</td>
                <td className={(sortedColumn === "points_pg" ? 'active' : '')}>{p.points_pg}</td>
                <td className={(sortedColumn === "shots_pg" ? 'active' : '')}>{p.shots_pg}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProspectTable;
