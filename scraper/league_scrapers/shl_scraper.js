module.exports.seasonScrape = function (season) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  // If Row Says Playoffs, Take Previous Regular Season Instead
  if (season('.rmss_t-stat-table__row').last().children('td:nth-child(2)').text() === "Slutspel") {
    goals = season('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(5)').text();
    assists = season('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(6)').text();
    points = season('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(7)').text();
    shots = season('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(10)').text();
    games_played = season('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(4)').text();
  } else {
    goals = season('.rmss_t-stat-table__row').last().children('td:nth-child(5)').text();
    assists = season('.rmss_t-stat-table__row').last().children('td:nth-child(6)').text();
    points = season('.rmss_t-stat-table__row').last().children('td:nth-child(7)').text();
    shots = season('.rmss_t-stat-table__row').last().children('td:nth-child(10)').text();
    games_played = season('.rmss_t-stat-table__row').last().children('td:nth-child(4)').text();
  }

  return [goals, assists, points, shots, games_played];
}