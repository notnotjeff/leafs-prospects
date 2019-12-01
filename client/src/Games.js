import React, { Component } from "react";
import firebase from "./firebase.js";
import "./Games.css";
import GamesTable from "./GamesTable";

class Games extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todaysGames: [],
      yesterdaysGames: [],
      updatedAt: ""
    };
  }

  componentDidMount() {
    const todaysRef = firebase.database().ref("todaysGames");
    const yesterdaysRef = firebase.database().ref("yesterdaysGames");
    const timeRef = firebase.database().ref("gamesScrapedTime");

    timeRef.on("value", snapshot => {
      let time = "";
      snapshot.forEach(snap => {
        time = String(snap.val().updatedAt);
      });

      this.setState({ updatedAt: time });
    });

    todaysRef.on("value", snapshot => {
      let todaysGames = [];
      snapshot.forEach(snap => {
        todaysGames.push(snap.val());
      });

      this.setState({ todaysGames });
    });

    yesterdaysRef.on("value", snapshot => {
      let yesterdaysGames = [];
      snapshot.forEach(snap => {
        yesterdaysGames.push(snap.val());
      });

      this.setState({ yesterdaysGames });
    });
  }

  render() {
    const { todaysGames, yesterdaysGames, updatedAt } = this.state;
    let gamesTables = (
      <div className="games-container">
        <GamesTable games={todaysGames} title="Today's Games" />
        <GamesTable games={yesterdaysGames} title="Yesterday's Games" />
      </div>
    );

    let updatedDiv =
      updatedAt === "" ? (
        <div className="updated-container"></div>
      ) : (
        <div className="updated-container">Updated at: {updatedAt} EST</div>
      );

    return (
      <section>
        {gamesTables}
        {updatedDiv}
      </section>
    );
  }
}

export default Games;
