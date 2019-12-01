// EXAMPLE
// {
//   profile_url: "http://www.vhlru.ru/en/players/22888/",
//   games_url: "http://www.vhlru.ru/en/players/22888/games",
//   league: "VHL",
// }

module.exports = {
  seasonScrape(season) {
    let goals = 0;
    let assists = 0;
    let points = 0;
    let shots = 0;
    let games_played = 0;
    let rowNumber = 4;

    // Set rowNumber to the right table row based on if their summary statline has playoffs or not (adds an extra row)
    rowNumber =
      season(
        `.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`
      ).text() === "SHL Summary"
        ? 5
        : 4;
    // If the last season was the playoffs skip it and go to regular season
    if (
      season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber + 1})`)
        .text()
        .includes("Playoffs")
    ) {
      rowNumber += 2;
    }

    goals = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`)
      .children("td:nth-child(4)")
      .text();
    assists = season(
      `.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`
    )
      .children("td:nth-child(5)")
      .text();
    points = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`)
      .children("td:nth-child(6)")
      .text();
    shots = season(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`)
      .children("td:nth-child(15)")
      .text();
    games_played = season(
      `.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`
    )
      .children("td:nth-child(3)")
      .text();

    return [goals, assists, points, shots, games_played];
  }
};
