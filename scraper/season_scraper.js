// Use 'node scraper/season_scraper.js' to run script

var rp              = require('request-promise');
var cheerio         = require('cheerio');
var backend         = require('./prospects.js');
var admin           = require('firebase-admin');
var dotenv          = require('dotenv');

var dateHelpers     = require('./helpers/date_helpers.js');
var generalHelpers  = require('./helpers/general_helpers.js');

var chlScraper      = require('./league_scrapers/chl_scraper.js');
var ahlScraper      = require('./league_scrapers/ahl_scraper.js');
var ushlScraper      = require('./league_scrapers/ushl_scraper.js');

dotenv.config();
const TESTING_MODE = false;

admin.initializeApp({
  credential: admin.credential.cert({
    "private_key": process.env.FIREBASE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_EMAIL,
    "project_id": "leafs-prospects"
  }),
  databaseURL: "https://leafs-prospects.firebaseio.com"
});

// Get And Set Backend Prospect Array
const prospects = backend.prospects;

// SCRAPING FUNCTION
function scrape(prospects) {
  let promises = [];

  prospects.forEach((p, i) => {
    if (p.league === "OHL" || p.league === "AHL" || p.league === "ECHL" || p.league === "WHL" || p.league === "USHL") {
      var url = {
        url: p.profile_url,
        json: true
      }
    } else {
      var url = {
        url: p.profile_url,
        transform: body => cheerio.load(body)
      }
    }

    promises.push(rp(url)
                    .then((data) => {
                      var first_name = p.first_name;
                      var last_name = p.last_name;
                      var league = p.league;
                      var position = p.position;
                      var shoots = p.shoots;
                      var age = generalHelpers.getAge(p.dob);
                      var ep_url = p.ep_url;
                      var round = p.round;
                      var draft_year = p.draft_year;
                      var pick = p.pick;

                      var goals = 0;
                      var assists = 0;
                      var points = 0;
                      var shots = 0;
                      var games_played = 0;

                      if (p.league === "OHL") {
                        [goals, assists, points, shots, games_played] = chlScraper.seasonScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "WHL") {
                        [goals, assists, points, shots, games_played] = chlScraper.seasonScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "QMJHL") {
                        [goals, assists, points, shots, games_played] = chlScraper.seasonScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "AHL") {
                        data = data.slice(5, data.length-1);
                        data = JSON.parse(data);
                        
                        [goals, assists, points, shots, games_played] = ahlScraper.seasonScrape(data.careerStats[0].sections[0].data, generalHelpers.getCurrentSeason());
                      } else if (p.league === "USHL") {
                        data = data.slice(5, data.length-1);
                        data = JSON.parse(data);
                        
                        [goals, assists, points, shots, games_played] = ushlScraper.seasonScrape(data.careerStats[0].sections[0].data, generalHelpers.getCurrentSeason());
                      } else if (p.league === "ECHL") {
                        let seasons = data.data.stats.history;
                        let seasonYears = generalHelpers.getCurrentSeason();

                        for (season of seasons) {
                          if (season.season.name === `${seasonYears} Regular Season`) {
                            goals = season.properties[1].value;
                            assists = season.properties[2].value;
                            points = season.properties[3].value;
                            shots = season.properties[10].value;
                            games_played = season.properties[0].value;
                          }
                        }
                      } else if (p.league === "KHL") {
                        // Check to make sure the row scraped is regular season not playoffs
                        if (data('#pl_Stats > tbody > tr:nth-child(1) > td:nth-child(1)').text().includes("Regular")) {
                          goals = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(4)').text();
                          assists = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(5)').text();
                          points = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(6)').text();
                          shots = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(17)').text();
                          games_played = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(3)').text();
                        } else {
                          goals = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(4)').text();
                          assists = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(5)').text();
                          points = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(6)').text();
                          shots = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(17)').text();
                          games_played = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(3)').text();
                        }
                      } else if (p.league === "SHL") {
                        // If Row Says Playoffs, Take Previous Regular Season Instead
                        if (data('.rmss_t-stat-table__row').last().children('td:nth-child(2)').text() === "Slutspel") {
                          goals = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(5)').text();
                          assists = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(6)').text();
                          points = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(7)').text();
                          shots = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(10)').text();
                          games_played = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(4)').text();
                        } else {
                          goals = data('.rmss_t-stat-table__row').last().children('td:nth-child(5)').text();
                          assists = data('.rmss_t-stat-table__row').last().children('td:nth-child(6)').text();
                          points = data('.rmss_t-stat-table__row').last().children('td:nth-child(7)').text();
                          shots = data('.rmss_t-stat-table__row').last().children('td:nth-child(10)').text();
                          games_played = data('.rmss_t-stat-table__row').last().children('td:nth-child(4)').text();
                        }
                      } else if (p.league === "VHL") {
                        let rowNumber = 4
                        
                        // Set rowNumber to the right table row based on if their summary statline has playoffs or not (adds an extra row)
                        data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).text() === "SHL Summary" ? rowNumber = 5 : rowNumber = 4;
                        // If the last season was the playoffs skip it and go to regular season
                        if (data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber + 1})`).text().includes("Playoffs")) { rowNumber += 2; }

                        goals = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(4)').text();
                        assists = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(5)').text();
                        points = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(6)').text();
                        shots = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(15)').text();
                        games_played = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(3)').text();
                      } else if (p.league === "NCAA") {
                        statGroup = data('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(3)').text().split('-');
                        goals = +statGroup[0];
                        assists = +statGroup[1];
                        points = +statGroup[2];
                        shots = +data('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(9)').text();
                        games_played = +data('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(1) > td:nth-child(2)').text().split(' ')[0];
                      } else if (p.league === "Liiga") {
                        goals = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(5)').text();
                        assists = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(6)').text();
                        points = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(7)').text();
                        shots = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(15)').text();
                        games_played = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(4)').text();
                      }

                      if (Number(games_played) > 0) {
                        games_played = Number(games_played);
                        var goals_pg = (goals / games_played).toFixed(2);
                        var assists_pg = (assists / games_played).toFixed(2);
                        var points_pg = (points / games_played).toFixed(2);
                        var shots_pg = (shots / games_played).toFixed(2);
                      } else {
                        var goals_pg = null;
                        var assists_pg = null;
                        var points_pg = null;
                        var shots_pg = null;
                        games_played = null;
                      }

                      goals = Number(goals);
                      assists = Number(assists);
                      points = Number(points);
                      shots = Number(shots);

                      return {
                        first_name,
                        last_name,
                        ep_url,
                        position,
                        shoots,
                        age,
                        league,
                        games_played,
                        goals,
                        assists,
                        points,
                        shots,
                        goals_pg,
                        assists_pg,
                        points_pg,
                        shots_pg,
                        round,
                        draft_year,
                        pick
                      };
                    })
                    .catch(err => {
                      console.log(err);
                    })
                  );
  });
  return Promise.all(promises);
}

async function updateDB() {
  let prospectData = await scrape(prospects);
  console.log('Completed Scrape');

  if (!TESTING_MODE) {
    // Set Time
    time = dateHelpers.getCurrentTime();

    let allTransactionPromises = [];
    const prospectsRef = admin.database().ref('prospects');
    const ranAtRef = admin.database().ref('prospectsScrapedTime');
    prospectsRef.set({});
    ranAtRef.set({});

    allTransactionPromises.push(ranAtRef.push({updatedAt: time}));

    prospectData.forEach(prospect => {
      let transactionPromise = prospectsRef.push(prospect);
      allTransactionPromises.push(transactionPromise);
    });

    await Promise.all(allTransactionPromises);
    console.log('Shutting Down DB Ref');
    admin.app().delete();

  } else {
    prospectData.forEach(prospect => {
      // Log Specific Prospect:
      if (prospect.last_name === "Piccinich") { console.log(prospect) };

      // Log All Prospects
      // console.log(prospect);
    });
  }
}

updateDB();