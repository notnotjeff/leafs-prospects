// Use 'node scraper.js' to run script

var rp      = require('request-promise');
var cheerio = require('cheerio');
var backend = require('./prospects.js');
var admin = require('firebase-admin');
var dotenv = require('dotenv');

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

function getAge(dateString)
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today - birthDate;
    return Math.floor(age/31557600000*10) / 10;
}

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
                      var age = getAge(p.dob);
                      var ep_url = p.ep_url;
                      var round = p.round;
                      var draft_year = p.draft_year;
                      var pick = p.pick;

                      if (p.league === "OHL") {
                        var goals = data.SiteKit.Player.regular[0].goals;
                        var assists = data.SiteKit.Player.regular[0].assists;
                        var points = data.SiteKit.Player.regular[0].points;
                        var shots = data.SiteKit.Player.regular[0].shots;
                        var games_played = data.SiteKit.Player.regular[0].games_played;
                      } else if (p.league === "WHL") {
                        var goals = data.SiteKit.Player.regular[0].goals;
                        var assists = data.SiteKit.Player.regular[0].assists;
                        var points = data.SiteKit.Player.regular[0].points;
                        var shots = data.SiteKit.Player.regular[0].shots;
                        var games_played = data.SiteKit.Player.regular[0].games_played;
                      } else if (p.league === "QMJHL") {
                        var goals = data.SiteKit.Player.regular[0].goals;
                        var assists = data.SiteKit.Player.regular[0].assists;
                        var points = data.SiteKit.Player.regular[0].points;
                        var shots = data.SiteKit.Player.regular[0].shots;
                        var games_played = data.SiteKit.Player.regular[0].games_played;
                      } else if (p.league === "AHL" || p.league === "ECHL" || p.league === "USHL") {
                        data = data.slice(5, data.length-1);
                        data = JSON.parse(data);
                        var goals = data.careerStats[0].sections[0].data[0].row.goals;
                        var assists = data.careerStats[0].sections[0].data[0].row.assists;
                        var points = data.careerStats[0].sections[0].data[0].row.points;
                        var shots = data.careerStats[0].sections[0].data[0].row.shots;
                        var games_played = data.careerStats[0].sections[0].data[0].row.games_played;
                      } else if (p.league === "KHL") {
                        // Check to make sure the row scraped is regular season not playoffs
                        if (data('#pl_Stats > tbody > tr:nth-child(1) > td:nth-child(1)').text().includes("Regular")) {
                          var goals = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(4)').text();
                          var assists = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(5)').text();
                          var points = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(6)').text();
                          var shots = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(17)').text();
                          var games_played = data('#pl_Stats > tbody > tr:nth-child(2) > td:nth-child(3)').text();
                        } else {
                          var goals = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(4)').text();
                          var assists = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(5)').text();
                          var points = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(6)').text();
                          var shots = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(17)').text();
                          var games_played = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(3)').text();
                        }
                      } else if (p.league === "SHL") {
                        // If Row Says Playoffs, Take Previous Regular Season Instead
                        if (data('.rmss_t-stat-table__row').last().children('td:nth-child(2)').text() === "Slutspel") {
                          var goals = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(5)').text();
                          var assists = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(6)').text();
                          var points = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(7)').text();
                          var shots = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(10)').text();
                          var games_played = data('.rmss_t-stat-table__row:nth-last-of-type(2)').children('td:nth-child(4)').text();
                        } else {
                          var goals = data('.rmss_t-stat-table__row').last().children('td:nth-child(5)').text();
                          var assists = data('.rmss_t-stat-table__row').last().children('td:nth-child(6)').text();
                          var points = data('.rmss_t-stat-table__row').last().children('td:nth-child(7)').text();
                          var shots = data('.rmss_t-stat-table__row').last().children('td:nth-child(10)').text();
                          var games_played = data('.rmss_t-stat-table__row').last().children('td:nth-child(4)').text();
                        }
                      } else if (p.league === "VHL") {
                        let rowNumber = 4
                        
                        // Set rowNumber to the right table row based on if their summary statline has playoffs or not (adds an extra row)
                        data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).text() === "SHL Summary" ? rowNumber = 5 : rowNumber = 4;
                        // If the last season was the playoffs skip it and go to regular season
                        if (data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber + 1})`).text().includes("Playoffs")) { rowNumber += 2; }

                        var goals = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(4)').text();
                        var assists = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(5)').text();
                        var points = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(6)').text();
                        var shots = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(15)').text();
                        var games_played = data(`.player_stats > tbody > tr:nth-last-of-type(${rowNumber})`).children('td:nth-child(3)').text();
                      } else if (p.league === "NCAA") {
                        var goals = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(4)').text();
                        var assists = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(5)').text();
                        var points = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(6)').text();
                        var shots = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(10)').text();
                        var games_played = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(3)').text();
                      } else if (p.league === "Liiga") {
                        var goals = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(5)').text();
                        var assists = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(6)').text();
                        var points = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(7)').text();
                        var shots = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(15)').text();
                        var games_played = data('#stats-section > table:nth-child(3) > tbody > tr > td:nth-child(4)').text();
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

function updateDB() {
  scrape(prospects)
    .then(data => {
      // Store Each Commit To DB As Promise In This Array So That We Can Shut Down DB Once They're All Done
      let allTransactionPromises = [];

      if (!TESTING_MODE) {
        const prospectsRef = admin.database().ref('prospects');
        prospectsRef.set({});

        data.forEach(prospect => {
          let transactionPromise = prospectsRef.push(prospect);
          allTransactionPromises.push(transactionPromise);
        });
      } else {
        data.forEach(prospect => {
          // Log Specific Prospect:
          if (prospect.last_name === "Greenway") { console.log(prospect) };

          // Log All Prospects
          // console.log(prospect);
        });
      }

      return Promise.all(allTransactionPromises);
    })
  .then(data => {
    console.log('Completed Scrape');
    console.log('Shutting Down DB Ref');
    admin.app().delete();
  })
  .catch(err => {
    console.log(err);
  });
}

updateDB();