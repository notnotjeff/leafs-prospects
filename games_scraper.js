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

    if (+today.getTimezoneOffset() === 0) { 
        today.setHours(today.getHours() - 4);
        yesterday.setHours(yesterday.getHours() - 4);
    }

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

function getDateFromString(date){
    date = date.split(' ');
    let day = date[0];
    let month = date[1];
    let year = date[2];

    month = new Date(Date.parse(month +" 1, 2012")).getMonth()+1;

    day = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${month}-${day}`;
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
                url: prospect.games_url,
                transform: body => cheerio.load(body)
            }
        }
        
        if (url["url"] !== undefined) {
            let scrapedProspect = await rp(url);

            if (prospect.league === "OHL" || prospect.league === "WHL") {
                let gameIndex = scrapedProspect.SiteKit.Player.games.length-1;

                // Skip If No Games
                if (gameIndex === -1) { continue }

                if (scrapedProspect.SiteKit.Player.games[gameIndex].date_played === `${year}-${month}-${day}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex].penalty_minutes;

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (scrapedProspect.SiteKit.Player.games[gameIndex].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }

                if (scrapedProspect.SiteKit.Player.games[gameIndex - 1].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            } else if (prospect.league === "AHL" || prospect.league === "USHL" || prospect.league === "ECHL") {
                data = scrapedProspect.slice(5, scrapedProspect.length-1);
                data = JSON.parse(data);
                let games = data.gameByGame[0].sections[0].data
                let gameIndex = games.length - 1;

                // Skip If No Games
                if (gameIndex === -1) { continue }

                if (games[gameIndex].row.date_played === `${year}-${month}-${day}`) {
                    let goals = +games[gameIndex].row.goals;
                    let assists = +games[gameIndex].row.assists;
                    let points = +games[gameIndex].row.points;
                    let shots = +games[gameIndex].row.shots;
                    let penaltyMinutes = +games[gameIndex].row.penalty_minutes;

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (games[gameIndex].row.date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +games[gameIndex].row.goals;
                    let assists = +games[gameIndex].row.assists;
                    let points = +games[gameIndex].row.points;
                    let shots = +games[gameIndex].row.shots;
                    let penaltyMinutes = +games[gameIndex].row.penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }

                if (games[gameIndex - 1].row.date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +games[gameIndex - 1].row.goals;
                    let assists = +games[gameIndex - 1].row.assists;
                    let points = +games[gameIndex - 1].row.points;
                    let shots = +games[gameIndex - 1].row.shots;
                    let penaltyMinutes = +games[gameIndex - 1].row.penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            } else if (prospect.league === "KHL") {            
                let date = getDateFromString(scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(4)').text());
                let secondLastDate = getDateFromString(scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(4)').text());
                
                if (`${year}-${month}-${day}` === date) {
                    let goals = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(8)').text();
                    let assists = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(9)').text();
                    let points = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(10)').text();
                    let shots = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(21)').text();
                    let penaltyMinutes = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(14)').text();


                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === date) {
                    let goals = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(8)').text();
                    let assists = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(9)').text();
                    let points = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(10)').text();
                    let shots = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(21)').text();
                    let penaltyMinutes = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(14)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === secondLastDate) {
                    let goals = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(8)').text();
                    let assists = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(9)').text();
                    let points = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(10)').text();
                    let shots = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(21)').text();
                    let penaltyMinutes = +scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(14)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }
            } else if (prospect.league === "Liiga") {
                // Skip To Next Prospect If No Games Have Been Played
                if (!scrapedProspect('#stats-section > table > tbody > tr:nth-child(1) > td:nth-child(1)').text().split('.').length === 3) { continue }

                // Get Date of Last Played Game
                let date = getDateFromString(scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(1)').text().split('.').join(' '));
                // If Prior Row Is a Monthly Total, Skip It, Then Use Row Number To Get Date of Second Last Played Game
                let row = scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(4) > td:nth-child(1)').text().includes('yht.') ? 5 : 4;
                let secondDate = getDateFromString(scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(1)`).text().split('.').join(' '));

                if (`${year}-${month}-${day}` === date) {
                    let goals = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(3)').text();
                    let assists = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(4)').text();
                    let points = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(5)').text();
                    let shots = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(13)').text();
                    let penaltyMinutes = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(6)').text();

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === date) {
                    let goals = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(3)').text();
                    let assists = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(4)').text();
                    let points = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(5)').text();
                    let shots = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(13)').text();
                    let penaltyMinutes = +scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(6)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === secondDate) {
                    let goals = +scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(3)`).text();
                    let assists = +scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(4)`).text();
                    let points = +scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(5)`).text();
                    let shots = +scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(13)`).text();
                    let penaltyMinutes = +scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(6)`).text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }
            } else if (prospect.league === "SHL") {
                let date = scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(1)').text();
                let yesterdayDate = scrapedProspect('.rmss_t-stat-table__row').first().next().children('td:nth-child(1)').text();

                if (`${year}-${month}-${day}` === date) {
                    let goals = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(5)').text();
                    let assists = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(6)').text();
                    let points = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(7)').text();
                    let penaltyMinutes = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(9)').text();
                    let shots = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(13)').text();

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === date) {
                    let goals = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(5)').text();
                    let assists = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(6)').text();
                    let points = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(7)').text();
                    let penaltyMinutes = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(9)').text();
                    let shots = +scrapedProspect('.rmss_t-stat-table__row').first().children('td:nth-child(13)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === yesterdayDate) {
                    let goals = +scrapedProspect('.rmss_t-stat-table__row').first().next().children('td:nth-child(5)').text();
                    let assists = +scrapedProspect('.rmss_t-stat-table__row').first().next().children('td:nth-child(6)').text();
                    let points = +scrapedProspect('.rmss_t-stat-table__row').first().next().children('td:nth-child(7)').text();
                    let penaltyMinutes = +scrapedProspect('.rmss_t-stat-table__row').first().next().children('td:nth-child(9)').text();
                    let shots = +scrapedProspect('.rmss_t-stat-table__row').first().next().children('td:nth-child(13)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
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
        // Set Time
        let day = new Date();
        let amPm = "";
        let hours = "";
        let minutes = day.getMinutes() < 10 ? `0${day.getMinutes()}` : `${day.getMinutes()}`;

        if (+day.getTimezoneOffset() === 0) { day.setHours(day.getHours() - 4) }
        
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