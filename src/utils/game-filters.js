const gameIsToday = game => {
  if ([undefined, null].includes(game.date_time)) {
    return false
  }

  const today = new Date(Date.now())
  const gameDate = new Date(Date.parse(String(game.date_time)))

  return today.toDateString() === gameDate.toDateString()
}

const gameWasYesterday = game => {
  if ([undefined, null].includes(game.date_time)) {
    return false
  }

  let yesterday = new Date(Date.now())
  yesterday.setDate(yesterday.getDate() - 1)
  const gameDate = new Date(Date.parse(String(game.date_time)))

  return yesterday.toDateString() === gameDate.toDateString()
}

export { gameIsToday, gameWasYesterday }
