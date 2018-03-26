import React, { Component } from 'react';
import './ProspectTable.css';

class ProspectTable extends Component {
  render() {
    const {prospects, categories, sortColumn} = this.props;
    return (
      <table>
        <thead>
          <tr>
            <th colSpan="5">Bio</th>
            <th colSpan="5">Stats</th>
            <th colSpan="4">Rates</th>
          </tr>

          <tr>
            {categories.map((c, i) =>
              <th
                key={i}
                onClick={() => { sortColumn(c.value) }}>{c.name}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {prospects.map((p, i) =>
            <tr key={i}>
              <td><a href={p.ep_url}>{p.first_name} {p.last_name}</a></td>
              <td>{p.league}</td>
              <td>{p.position}</td>
              <td>{p.shoots}</td>
              <td>{p.age}</td>
              <td>{p.games_played}</td>
              <td>{p.goals}</td>
              <td>{p.assists}</td>
              <td>{p.points}</td>
              <td>{p.shots}</td>
              <td>{p.goals_pg}</td>
              <td>{p.assists_pg}</td>
              <td>{p.points_pg}</td>
              <td>{p.shots_pg}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default ProspectTable;
