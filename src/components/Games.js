import React from 'react'
import './Games.css'
import GamesTable from './GamesTable'
import { useGames } from 'queries/games'
import { gameIsToday, gameWasYesterday } from 'utils/game-filters'

const Games = () => {
  const { status, data } = useGames()

  if (status === 'loading') {
    return <div className="loading">Collecting data...</div>
  }
  if (status === 'error') {
    return <div className="loading">Unable to load data!</div>
  }

  const todaysGames = data.filter(gameIsToday)
  const yesterdaysGames = data.filter(gameWasYesterday)
  const updatedAt = todaysGames?.[0]?.updated_at
    ? new Date(Date.parse(String(todaysGames?.[0]?.updated_at))).toLocaleString()
    : new Date().toLocaleString()

  return (
    <section>
      <div className="games-container">
        <GamesTable games={todaysGames} title="Today's Games" />
        <GamesTable games={yesterdaysGames} title="Yesterday's Games" />
      </div>
      <div className="updated-container">Updated at: {updatedAt} EST</div>
    </section>
  )
}

export default Games
