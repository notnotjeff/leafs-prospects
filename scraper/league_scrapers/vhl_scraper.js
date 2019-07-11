// EXAMPLE
// {
//   profile_url: "http://www.vhlru.ru/en/players/22888/",
//   games_url: "http://www.vhlru.ru/en/players/22888/games",
//   league: "VHL",
// }

module.exports.seasonScrape = function (season) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  let rowNumber = 4
                    
  // Set rowNumber to the right table row based on if their summary statline has playoffs or not (adds an extra row)
  season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).text() === "SHL Summary" ? rowNumber = 5 : rowNumber = 4;
  // If the last season was the playoffs skip it and go to regular season
  if (season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber + 1})`).text().includes("Playoffs")) { rowNumber += 2; }
  
  goals = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(4)').text();
  assists = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(5)').text();
  points = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(6)').text();
  shots = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(15)').text();
  games_played = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(3)').text();

  return [goals, assists, points, shots, games_played];
}