const gameIsToday = (game) => {
  if (game.date === undefined) { return false; }

  const today = new Date();
  const gameDate = new Date(Date.parse(String(game.date)));

  return today.toDateString() === gameDate.toDateString();  
}

const gameWasYesterday = (game) => {
  if (game.date === undefined) { return false; }

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const gameDate = new Date(Date.parse(String(game.date)));

  return yesterday.toDateString() === gameDate.toDateString();
}

export { gameIsToday, gameWasYesterday };