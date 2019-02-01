module.exports.seasonScrape = function (season) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  statGroup = season('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(3)').text().split('-');
  goals = +statGroup[0];
  assists = +statGroup[1];
  points = +statGroup[2];
  shots = +season('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(9)').text();
  games_played = +season('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(2)').text().split(' ')[0];

  return [goals, assists, points, shots, games_played];
}