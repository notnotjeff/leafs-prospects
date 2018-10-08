import React, { Component } from 'react';
import firebase from './firebase.js';
import './Games.css';
import GamesTable from './GamesTable';

class Games extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todaysGames: [],
            yesterdaysGames: []
        }
    }

    componentDidMount() {
        const todaysRef = firebase.database().ref('todaysGames');
        const yesterdaysRef = firebase.database().ref('yesterdaysGames');
        let todaysGames = [];
        let yesterdaysGames = [];
    
        todaysRef.on('value', (snapshot) => {
          snapshot.forEach(snap => {
            todaysGames.push(snap.val());
          });

          this.setState({ todaysGames });
        });

        yesterdaysRef.on('value', (snapshot) => {
            snapshot.forEach(snap => {
              yesterdaysGames.push(snap.val());
            }); 

            this.setState({ yesterdaysGames });
        });
    }

    render() {
        const {todaysGames, yesterdaysGames} = this.state;
        let gamesTables = <div className="loading">Collecting data...</div>;

        if (this.state.todaysGames.length !== 0) {
            gamesTables = (
                <div className="tables-container">
                    <GamesTable games={todaysGames} title="Today's Games" />
                    <GamesTable games={yesterdaysGames} title="Yesterday's Games" />
                </div>
            );
        }

        return (
            <div className="games-container">
                {gamesTables}
            </div>
        );
    }
}

export default Games;