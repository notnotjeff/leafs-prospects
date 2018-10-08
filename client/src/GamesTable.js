import React, { Component } from 'react';
import './GamesTable.css';

class GamesTable extends Component {
    render() {
        const {games, title} = this.props;

        let gamesRows = (
            <tr>
                <td>No Data</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>  
        )

        if (games.length !== 0) {
            gamesRows = (
                games.map((game, i) => 
                    <tr key={i}>
                        <td>{game.fullName}</td>
                        <td>{game.shots}</td>
                        <td>{game.goals}</td>
                        <td>{game.assists}</td>
                        <td>{game.points}</td>
                        <td>{game.penaltyMinutes}</td>
                    </tr>  
                )
            )
        }

        return(
            <table>
                <thead>
                    <tr>
                        <th colSpan="6">{title}</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>S</th>
                        <th>G</th>
                        <th>A</th>
                        <th>P</th>
                        <th>PIM</th>
                    </tr>
                </thead>
                <tbody>
                    {gamesRows}
                </tbody>
            </table>
        );
    }
}

export default GamesTable;