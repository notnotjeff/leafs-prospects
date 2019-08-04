// EXAMPLE
// {
//   profile_url: "http://www.leijonat.fi/modules/mod_playercardseriestats/helper/getplayerseriestats.php?lkq=448645413073080382451268&age=18&season=2019&isgoalie=0&isskater=1",
//   games_url: "http://www.leijonat.fi/modules/mod_playercardseriestats/helper/getplayerseriestats.php?lkq=448645413073080382451268&age=18&season=2019&isgoalie=0&isskater=1",
//   league: "Mestis",
// }

module.exports = {
  seasonScrape(leagues) {
    const stats = leagues.SkaterLevels.find(l => l.LevelName === 'Mestis');

    const goals = stats.LevelGoals || null;
    const assists = stats.LevelAssists || null;
    const points = stats.LevelPoints || null;
    const shots = null;
    const games_played = stats.PlayedLevelGames || null;

    return [goals, assists, points, shots, games_played];
  },
};
