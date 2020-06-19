import React, { useState, useEffect } from "react";
import firebase from "./firebase.js";
import "./Games.css";
import GamesTable from "./GamesTable";

function useTodaysGames() {
  const [todaysGames, setTodaysGames] = useState([])
  
  useEffect(() => {
    firebase.database()
    .ref("todaysGames")
    .on("value", snapshot => {
        const tGames = [];

        snapshot.forEach(snap => {
          tGames.push(snap.val());
        });

        setTodaysGames(tGames)
      });
  }, [])

  return todaysGames;

}

function useYesterdaysGames() {
  const [yesterdaysGames, setYesterdaysGames] = useState([])
  
  useEffect(() => {    
    firebase.database()
    .ref("yesterdaysGames")
    .on("value", snapshot => {
      const yGames = [];

      snapshot.forEach(snap => {
          yGames.push(snap.val());
        });

        setYesterdaysGames(yGames)
      });
  }, [])

  return yesterdaysGames;
}

function useUpdatedAt() {
  const [updatedAt, setUpdatedAt] = useState('')
  
  useEffect(() => {
    
    firebase.database()
    .ref("gamesScrapedTime")
    .on("value", snapshot => {
        let time = "";

        snapshot.forEach(snap => {
          time = String(snap.val().updatedAt);
        });

        setUpdatedAt(time);
      });
  }, [])

  return updatedAt;
}

function Games() {
  const todaysGames = useTodaysGames();
  const yesterdaysGames = useYesterdaysGames();
  const updatedAt = useUpdatedAt();

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

export default Games;
