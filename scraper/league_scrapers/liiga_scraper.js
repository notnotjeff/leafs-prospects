// EXAMPLE
// {
//   profile_url: "http://liiga.fi/pelaajat/100025980/lindgren-jesper",
//   games_url: "http://liiga.fi/fi/pelaajat/100025980/lindgren-jesper/ottelu-ottelulta",
//   league: "Liiga",
// }

module.exports.seasonScrape = function (season) {
  let goals = 0,
      assists = 0,
      points = 0,
      shots = 0,
      games_played = 0;

  const today = new Date
  const currentSeason = today.getMonth() + 1 < 8 ? `${today.getFullYear() - 1}-${today.getFullYear()}` : `${today.getFullYear()}-${today.getFullYear() + 1}`
  const tableCheckRow = season('#stats-section > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(1)').text().trim();
  const table = tableCheckRow === 'Yhteensä' ? 3 : 6;
  const tableCheckYear = season(`#stats-section > table:nth-child(${table}) > tbody > tr:nth-last-child(2) > td:nth-child(1)`).text().trim();
  const row = tableCheckYear === currentSeason ? 2 : 3;

  goals = season(`#stats-section > table:nth-child(${table}) > tbody > tr:nth-last-child(${row}) > td:nth-child(5)`).text();
  assists = season(`#stats-section > table:nth-child(${table}) > tbody > tr:nth-last-child(${row}) > td:nth-child(6)`).text();
  points = season(`#stats-section > table:nth-child(${table}) > tbody > tr:nth-last-child(${row}) > td:nth-child(7)`).text();
  shots = season(`#stats-section > table:nth-child(${table}) > tbody > tr:nth-last-child(${row}) > td:nth-child(15)`).text();
  games_played = season(`#stats-section > table:nth-child(${table}) > tbody > tr:nth-last-child(${row}) > td:nth-child(4)`).text();

  return [goals, assists, points, shots, games_played];
}