module.exports.ahlSeasonScrape = function (seasons, currentSeason) {
  currentSeasons = seasons.filter((season) => {
    return season.row.season_name === `${currentSeason} Regular Season`;
  });

  let goals = 0, 
      assists = 0, 
      points = 0, 
      shots = 0, 
      games_played = 0;

  for (season of currentSeasons) {
    goals += +season.row.goals;
    assists += +season.row.assists;
    points += +season.row.points;
    shots += +season.row.shots;
    games_played += +season.row.games_played;
  }

  return [goals, assists, points, shots, games_played];
}