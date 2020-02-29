import React, { Component } from "react";
import "./GamesTable.css";

class GamesTable extends Component {
  render() {
    const { games, title } = this.props;

    let gamesRows = (
      <tr>
        <td className="last_name">No Data</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );

    if (games.length !== 0) {
      gamesRows = games.map((game, i) => (
        <tr key={i}>
          <td className="last_name">{game.fullName}</td>
          <td>{game.league}</td>
          <td>{game.shots}</td>
          <td>{game.goals}</td>
          <td>{game.assists}</td>
          <td>{game.points}</td>
          <td>{game.penaltyMinutes}</td>
        </tr>
      ));
    }

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="1" className="last_name">
                {title}
              </th>
              <th colSpan="6"></th>
            </tr>
            <tr>
              <th className="last_name">Name</th>
              <th>League</th>
              <th>S</th>
              <th>G</th>
              <th>A</th>
              <th>P</th>
              <th>PIM</th>
            </tr>
          </thead>
          <tbody>{gamesRows}</tbody>
        </table>
      </div>
    );
  }
}

export default GamesTable;
