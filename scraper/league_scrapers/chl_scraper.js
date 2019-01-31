module.exports.chlSeasonScrape = function (seasons, currentSeasonId) {
  currentSeasons = seasons.filter((season) => {
    return +season.season_id === +currentSeasonId && season.season_name !== 'total'
  });

  let goals = 0, 
      assists = 0, 
      points = 0, 
      shots = 0, 
      games_played = 0;

  for (season of currentSeasons) {
    goals += +season.goals;
    assists += +season.assists;
    points += +season.points;
    shots += +season.shots;
    games_played += +season.games_played;
  }

  return [goals, assists, points, shots, games_played];
}