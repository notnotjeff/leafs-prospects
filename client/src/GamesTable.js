import React, { Component } from 'react';
import './GamesTable.css';

class GamesTable extends Component {
    render() {
        const {games, title} = this.props;

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
                    {games.map((game, i) => 
                        <tr key={i}>
                            <td>{game.fullName}</td>
                            <td>{game.shots}</td>
                            <td>{game.goals}</td>
                            <td>{game.assists}</td>
                            <td>{game.points}</td>
                            <td>{game.penaltyMinutes}</td>
                        </tr>  
                    )}
                </tbody>
            </table>
        );
    }
}

export default GamesTable;