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
var ushlScraper     = require('./league_scrapers/ushl_scraper.js');
var echlScraper     = require('./league_scrapers/echl_scraper.js');
var khlScraper      = require('./league_scrapers/khl_scraper.js');
var shlScraper      = require('./league_scrapers/shl_scraper.js');
var vhlScraper      = require('./league_scrapers/vhl_scraper.js');
var ncaaScraper      = require('./league_scrapers/ncaa_scraper.js');
var liigaScraper      = require('./league_scrapers/liiga_scraper.js');

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
                      let first_name = p.first_name;
                      let last_name = p.last_name;
                      let league = p.league;
                      let position = p.position;
                      let shoots = p.shoots;
                      let age = generalHelpers.getAge(p.dob);
                      let ep_url = p.ep_url;
                      let round = p.round;
                      let draft_year = p.draft_year;
                      let pick = p.pick;

                      let goals = 0;
                      let assists = 0;
                      let points = 0;
                      let shots = 0;
                      let games_played = 0;

                      if (p.league === "OHL") {
                        [goals, assists, points, shots, games_played] = chlScraper.seasonScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "WHL") {
                        [goals, assists, points, shots, games_played] = chlScraper.seasonScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "QMJHL") {
                        [goals, assists, points, shots, games_played] = chlScraper.seasonScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "AHL") {
                        data = JSON.parse(data.slice(5, data.length-1));
                        [goals, assists, points, shots, games_played] = ahlScraper.seasonScrape(data.careerStats[0].sections[0].data, generalHelpers.getCurrentSeason());
                      } else if (p.league === "USHL") {
                        data = JSON.parse(data.slice(5, data.length-1));
                        [goals, assists, points, shots, games_played] = ushlScraper.seasonScrape(data.careerStats[0].sections[0].data, generalHelpers.getCurrentSeason());
                      } else if (p.league === "ECHL") {
                        [goals, assists, points, shots, games_played] = echlScraper.seasonScrape(data.data.stats.history, generalHelpers.getCurrentSeason());
                      } else if (p.league === "KHL") {
                        [goals, assists, points, shots, games_played] = khlScraper.seasonScrape(data);
                      } else if (p.league === "SHL") {
                        [goals, assists, points, shots, games_played] = shlScraper.seasonScrape(data);
                      } else if (p.league === "VHL") {
                        [goals, assists, points, shots, games_played] = vhlScraper.seasonScrape(data);
                      } else if (p.league === "NCAA") {
                        [goals, assists, points, shots, games_played] = ncaaScraper.seasonScrape(data);
                      } else if (p.league === "Liiga") {
                        [goals, assists, points, shots, games_played] = liigaScraper.seasonScrape(data);
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