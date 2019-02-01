module.exports.seasonScrape = function (season) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  // Check to make sure the row scraped is regular season not playoffs
  if (season('#pl_Stats > tbody > tr:nth-child(1) > td:nth-child(1)').text().includes("Regular")) {
    goals = season('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(4)').text();
    assists = season('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(5)').text();
    points = season('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(6)').text();
    shots = season('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(17)').text();
    games_played = season('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(3)').text();
  } else {
    goals = season('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(4)').text();
    assists = season('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(5)').text();
    points = season('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(6)').text();
    shots = season('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(17)').text();
    games_played = season('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(3)').text();
  }

  return [goals, assists, points, shots, games_played];
}