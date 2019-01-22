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

// HELPER FUNCTIONS
function getAge(dateString)
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today - birthDate;
    return Math.floor(age/31557600000*10) / 10;
}

function getCurrentSeason() {
  // Return string in format YYYY-YY eg: 2018-19
  let date = new Date();
  let month = date.getMonth() + 1;

  if (month > 8) {
    return `${date.getFullYear()}-${(date.getFullYear() + 1).toString().substr(-2)}`;
  } else {
    date.setFullYear(date.getFullYear() - 1);
    return `${date.getFullYear()}-${(date.getFullYear() + 1).toString().substr(-2)}`;
  }
}

// FUNCTIONS FOR DAYLIGHT SAVINGS TIME
function isDaylightSavings(today) {
  const dstStart = getDateOfSundayInMonth(2, 3);
  const dstEnd = getDateOfSundayInMonth(1, 11);
  const offsetHours = today.getTimezoneOffset() === 0 ? 0 : 4; // If run locally in EST you need to offset for time difference from UTC

  // If today is the start of daylight savings, check if it's past 2AM EST from UTC (should be 5 hours ahead during non-DST period)
  if (`${today.getMonth()}-${today.getDate()}` === `${dstStart.getMonth()}-${dstStart.getDate()}`) {
    return today.getHours() >= (7 - offsetHours) ? true : false;
  // If today is end of daylight savings, check if it's past 2AM EST from UTC (should be 4 hours ahead during DST period)
  } else if (`${today.getMonth()}-${today.getDate()}` === `${dstEnd.getMonth()}-${dstEnd.getDate()}`) {
    return today.getHours() >= (6 - offsetHours) ? false : true;
  // Else check if it is in between the DST period and return the proper value
  } else {
    return today < dstEnd && today >= dstStart ? true : false;
  }
}

function getDateOfSundayInMonth(sundayNumber, month) {
  // Format variables from real world values to computer values
  sundayNumber = (sundayNumber - 1) * 7;
  month = month - 1;

  const currentYear = new Date().getFullYear();
  const start = new Date(currentYear, month, sundayNumber);
  const sunday = sundayNumber + (7 - start.getDay());

  return new Date(currentYear, month, sunday); 
}

// LEAGUE HELPER FUNCTIONS

chlScrape = (seasons, currentSeasonId) => {
  currentSeasons = seasons.filter((season) => {
    return +season.season_id === +currentSeasonId && season.season_name !== 'total'
  });

  let goals = 0, 
      assists = 0, 
      points = 0, 
      shots = 0, 
      games_played = 0;

  for (season of currentSeasons) {
    goals += +season.goals;
    assists += +season.assists;
    points += +season.points;
    shots += +season.shots;
    games_played += +season.games_played;
  }

  return [goals, assists, points, shots, games_played];
}

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
                      var age = getAge(p.dob);
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
                        [goals, assists, points, shots, games_played] = chlScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "WHL") {
                        [goals, assists, points, shots, games_played] = chlScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "QMJHL") {
                        [goals, assists, points, shots, games_played] = chlScrape(data.SiteKit.Player.regular, data.SiteKit.Player.regular[0].season_id);
                      } else if (p.league === "AHL" || p.league === "USHL") {
                        data = data.slice(5, data.length-1);
                        data = JSON.parse(data);
                        goals = data.careerStats[0].sections[0].data[0].row.goals;
                        assists = data.careerStats[0].sections[0].data[0].row.assists;
                        points = data.careerStats[0].sections[0].data[0].row.points;
                        shots = data.careerStats[0].sections[0].data[0].row.shots;
                        games_played = data.careerStats[0].sections[0].data[0].row.games_played;
                      } else if (p.league === "ECHL") {
                        let seasons = data.data.stats.history;
                        let seasonYears = getCurrentSeason();

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
    let day = new Date();
    let amPm = "";
    let hours = "";
    let minutes = day.getMinutes() < 10 ? `0${day.getMinutes()}` : `${day.getMinutes()}`;

    let offsetHours = isDaylightSavings(day) ? 4 : 5;

    if (+day.getTimezoneOffset() === 0) { day.setHours(day.getHours() - offsetHours) }
    
    if (+day.getHours() < 12) { 
      hours = String(day.getHours());
    } else {
      hours = String(day.getHours() - 12);
    }
      
    amPm = +day.getHours() < 12 ? "am" : "pm";
    if (+hours === 0) {
      hours = 12;
    }

    time = `${hours}:${minutes}${amPm}`;

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