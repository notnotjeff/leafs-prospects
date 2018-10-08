// Use 'node scraper.js' to run script

var rp      = require('request-promise');
var cheerio = require('cheerio');
var backend = require('./prospects.js');
var admin   = require('firebase-admin');
var dotenv  = require('dotenv');

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

function setDateValues() {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let day = String(today.getDate());
    let month = String(today.getMonth() + 1);
    let year = String(today.getFullYear());

    let yDay = String(yesterday.getDate());
    let yMonth = String(yesterday.getMonth() + 1);
    let yYear = String(yesterday.getFullYear());
    
    day = day < 10 ? `0${day}` : `${day}`;
    yDay = yDay < 10 ? `0${yDay}` : `${yDay}`;

    return {day, month, year, yDay, yMonth, yYear};
}

async function scrape_games(prospects) {
    let todaysGames = [];
    let yesterdaysGames = [];

    let {day, month, year, yDay, yMonth, yYear} = setDateValues();

    for (const prospect of prospects) {
        if (prospect.league === "OHL" || prospect.league === "AHL" || prospect.league === "ECHL" || prospect.league === "WHL" || prospect.league === "USHL") {
            var url = {
                url: prospect.games_url,
                json: true
            }
        } else {
            var url = {
                url: prospect.profile_url,
                transform: body => cheerio.load(body)
            }
        }
        
        if (url["url"] !== undefined) {
            let scrapedProspect = await rp(url);

            if (prospect.league === "OHL" || prospect.league === "WHL") {
                let gameIndex = scrapedProspect.SiteKit.Player.games.length-1;

                if (scrapedProspect.SiteKit.Player.games[gameIndex].date_played === `${year}-${month}-${day}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex].penalty_minutes;

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (scrapedProspect.SiteKit.Player.games[gameIndex].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }

                if (scrapedProspect.SiteKit.Player.games[gameIndex - 1].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            } else if (prospect.league === "AHL") {
                data = scrapedProspect.slice(5, scrapedProspect.length-1);
                data = JSON.parse(data);
                let games = data.gameByGame[0].sections[0].data
                let gameIndex = games.length - 1;

                if (games[gameIndex].row.date_played === `${year}-${month}-${day}`) {
                    let goals = +games[gameIndex].row.goals;
                    let assists = +games[gameIndex].row.assists;
                    let points = +games[gameIndex].row.points;
                    let shots = +games[gameIndex].row.shots;
                    let penaltyMinutes = +games[gameIndex].row.penalty_minutes;

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (games[gameIndex].row.date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +games[gameIndex].row.goals;
                    let assists = +games[gameIndex].row.assists;
                    let points = +games[gameIndex].row.points;
                    let shots = +games[gameIndex].row.shots;
                    let penaltyMinutes = +games[gameIndex].row.penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }

                if (games[gameIndex - 1].row.date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +games[gameIndex - 1].row.goals;
                    let assists = +games[gameIndex - 1].row.assists;
                    let points = +games[gameIndex - 1].row.points;
                    let shots = +games[gameIndex - 1].row.shots;
                    let penaltyMinutes = +games[gameIndex - 1].row.penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            }
        }
    }

    return {todaysGames, yesterdaysGames};
}

async function addGames() {
    console.log('Start Scrape...');
    let {todaysGames, yesterdaysGames} = await scrape_games(prospects);
    console.log('Completed Scrape!');

    if (!TESTING_MODE) {
        let day = new Date();
        let amPm = day.getHours() < 12 ? "am" : "pm";
        time = `${day.getHours() + 12}:${day.getMinutes()}${amPm}`;

        let allTransactionPromises = [];
        const todaysRef = admin.database().ref('todaysGames');
        const yesterdaysRef = admin.database().ref('yesterdaysGames');
        const ranAtRef = admin.database().ref('gamesScrapedTime');

        todaysRef.set({});
        yesterdaysRef.set({});
        ranAtRef.set({});

        allTransactionPromises.push(ranAtRef.push({updatedAt: time}));
    
        for (game of todaysGames) {
            let transactionPromise = todaysRef.push(game);
            allTransactionPromises.push(transactionPromise);
        }

        for (game of yesterdaysGames) {
            let transactionPromise = yesterdaysRef.push(game);
            allTransactionPromises.push(transactionPromise);
        }
    
        await Promise.all(allTransactionPromises);
        console.log('Shutting Down DB Ref');
        admin.app().delete();
    
    } else {
        // Cycle Through Today's Games
        for (game of todaysGames) {
            // Log Specific Game:
            if (game.last_name === "Liljegren") { console.log(game) };

            // Log All Games
            // console.log(game);
        }

        // Cycle Through Yesterdays's Games
        for (game of yesterdaysGames) {
            // Log Specific Game:
            if (game.last_name === "Liljegren") { console.log(game) };
      
            // Log All Games
            // console.log(game);
        }
    }
}

addGames();