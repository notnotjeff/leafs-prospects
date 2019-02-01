module.exports.seasonScrape = function (season) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  goals = season('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(5)').text();
  assists = season('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(6)').text();
  points = season('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(7)').text();
  shots = season('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(15)').text();
  games_played = season('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(4)').text();

  return [goals, assists, points, shots, games_played];
}