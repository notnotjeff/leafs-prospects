module.exports.seasonScrape = function (seasons, currentSeason) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  for (season of seasons) {
    if (season.season.name === `${currentSeason} Regular Season`) {
      goals += season.properties[1].value;
      assists += season.properties[2].value;
      points += season.properties[3].value;
      shots += season.properties[10].value;
      games_played += season.properties[0].value;
    }
  }

  return [goals, assists, points, shots, games_played]
}