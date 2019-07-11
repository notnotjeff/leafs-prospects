// Use 'node scraper/games_scraper.js' to run script

var rp          = require('request-promise');
var cheerio     = require('cheerio');
var backend     = require('./prospects.js');
var admin       = require('firebase-admin');
var dotenv      = require('dotenv');
var dateHelpers = require('./helpers/date_helpers.js');

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

async function scrape_games(prospects) {
    let todaysGames = [];
    let yesterdaysGames = [];

    let {day, month, year, yDay, yMonth, yYear} = dateHelpers.setDateValues();
    
    for (const prospect of prospects) {
        if (prospect.league === "OHL" || prospect.league === "AHL" || prospect.league === "ECHL" || prospect.league === "WHL" || prospect.league === "USHL" || prospect.league === "QMJHL") {
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

                if (gameIndex - 1 === -1) { continue }

                if (scrapedProspect.SiteKit.Player.games[gameIndex - 1].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].goals;
                    let assists = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].assists;
                    let points = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].points;
                    let shots = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].shots;
                    let penaltyMinutes = +scrapedProspect.SiteKit.Player.games[gameIndex - 1].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            } else if (prospect.league === "QMJHL") {
                const parsedData = JSON.parse(scrapedProspect.substr(5, scrapedProspect.length - 6));
                continue

                const monthName = dateHelpers.getMonthName(+month);
                const yMonthName = dateHelpers.getMonthName(+yMonth);
                let gameIndex = parsedData.SiteKit.Gamebygame.games.length-1;

                // Skip If No Games
                if (gameIndex === -1) { continue }

                // All this below will need to be changed because it's a copy of the OHL one and doesn't actually work!!!!!!
                if (parsedData.SiteKit.Player.games[gameIndex].date_played === `${year}-${month}-${day}`) {
                    let goals = +parsedData.SiteKit.Player.games[gameIndex].goals;
                    let assists = +parsedData.SiteKit.Player.games[gameIndex].assists;
                    let points = +parsedData.SiteKit.Player.games[gameIndex].points;
                    let shots = +parsedData.SiteKit.Player.games[gameIndex].shots;
                    let penaltyMinutes = +parsedData.SiteKit.Player.games[gameIndex].penalty_minutes;

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (parsedData.SiteKit.Player.games[gameIndex].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +parsedData.SiteKit.Player.games[gameIndex].goals;
                    let assists = +parsedData.SiteKit.Player.games[gameIndex].assists;
                    let points = +parsedData.SiteKit.Player.games[gameIndex].points;
                    let shots = +parsedData.SiteKit.Player.games[gameIndex].shots;
                    let penaltyMinutes = +parsedData.SiteKit.Player.games[gameIndex].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }

                if (gameIndex - 1 === -1) { continue }

                if (parsedData.SiteKit.Player.games[gameIndex - 1].date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +parsedData.SiteKit.Player.games[gameIndex - 1].goals;
                    let assists = +parsedData.SiteKit.Player.games[gameIndex - 1].assists;
                    let points = +parsedData.SiteKit.Player.games[gameIndex - 1].points;
                    let shots = +parsedData.SiteKit.Player.games[gameIndex - 1].shots;
                    let penaltyMinutes = +parsedData.SiteKit.Player.games[gameIndex - 1].penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            } else if (prospect.league === "AHL" || prospect.league === "USHL") {
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

                if (gameIndex - 1 === -1) { continue }

                if (games[gameIndex - 1].row.date_played === `${yYear}-${yMonth}-${yDay}`) {
                    let goals = +games[gameIndex - 1].row.goals;
                    let assists = +games[gameIndex - 1].row.assists;
                    let points = +games[gameIndex - 1].row.points;
                    let shots = +games[gameIndex - 1].row.shots;
                    let penaltyMinutes = +games[gameIndex - 1].row.penalty_minutes;

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${yYear}-${yMonth}-${yDay}`})
                }
            } else if (prospect.league === "KHL") {        
                let date = dateHelpers.getDateFromArray(scrapedProspect('#pl_Games > tbody > tr:nth-last-child(1) > td:nth-child(4)').text().split(' '), 2, 1, 0);
                let secondLastDate = dateHelpers.getDateFromArray(scrapedProspect('#pl_Games > tbody > tr:nth-last-child(2) > td:nth-child(4)').text().split(' '), 2, 1, 0);
                
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
                let date = dateHelpers.getDateFromArray(scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(3) > td:nth-child(1)').text().split('.'), 2, 1, 0);
                // If Prior Row Is a Monthly Total, Skip It, Then Use Row Number To Get Date of Second Last Played Game
                let row = scrapedProspect('#stats-section > table > tbody > tr:nth-last-child(4) > td:nth-child(1)').text().includes('yht.') ? 5 : 4;
                let secondDate = dateHelpers.getDateFromArray(scrapedProspect(`#stats-section > table > tbody > tr:nth-last-child(${row}) > td:nth-child(1)`).text().split('.'), 2, 1, 0);

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
            } else if (prospect.league === "VHL") {
                let date = dateHelpers.getDateFromArray(scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(1)').text().split('.'), 2, 1, 0);
                let secondLastDate = dateHelpers.getDateFromArray(scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(2) > td:nth-child(1)').text().split('.'), 2, 1, 0);

                if (`${year}-${month}-${day}` === date) {
                    let goals = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(6)').text();
                    let assists = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(7)').text();
                    let points = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(8)').text();
                    let shots = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(17)').text();
                    let penaltyMinutes = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(10)').text();

                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === date) {
                    let goals = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(6)').text();
                    let assists = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(7)').text();
                    let points = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(8)').text();
                    let shots = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(17)').text();
                    let penaltyMinutes = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(1) > td:nth-child(10)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === secondLastDate) {
                    let goals = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(2) > td:nth-child(6)').text();
                    let assists = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(2) > td:nth-child(7)').text();
                    let points = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(2) > td:nth-child(8)').text();
                    let shots = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(2) > td:nth-child(17)').text();
                    let penaltyMinutes = +scrapedProspect('#laConteiner > table > tbody > tr:nth-last-child(2) > td:nth-child(10)').text();

                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }
            } else if (prospect.league === "NCAA") {
                let date = dateHelpers.getDateFromArray(scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(2) > td:nth-child(1)').text().split('/'), 2, 0, 1);
                let yesterdayDate = dateHelpers.getDateFromArray(scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(3) > td:nth-child(1)').text().split('/'), 2, 1, 0);

                let statGroup = scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(2) > td:nth-child(4)').text().split('-');
                if (statGroup.length > 3) { continue }

                if (`${year}-${month}-${day}` === date) {
                    let goals = +statGroup[0];
                    let assists = +statGroup[1];
                    let points = +statGroup[2];
                    let shots = +scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(2) > td:nth-child(12)').text();
                    let penaltyMinutes = +scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(2) > td:nth-child(11)').text().split('/')[1];
    
                    todaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === date) {
                    let goals = +statGroup[0];
                    let assists = +statGroup[1];
                    let points = +statGroup[2];
                    let shots = +scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(2) > td:nth-child(12)').text();
                    let penaltyMinutes = +scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(2) > td:nth-child(11)').text().split('/')[1];
    
                    yesterdaysGames.push({fullName: `${prospect.first_name} ${prospect.last_name}`, league: prospect.league, goals, assists, points, shots, penaltyMinutes, gameDate: `${year}-${month}-${day}`})
                }

                if (`${yYear}-${yMonth}-${yDay}` === yesterdayDate) {
                    let goals = +statGroup[0];
                    let assists = +statGroup[1];
                    let points = +statGroup[2];
                    let shots = +scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(3) > td:nth-child(12)').text();
                    let penaltyMinutes = +scrapedProspect('body > div.page.text-center > main > section > div > div > div > div.playerstatsfull > table:nth-child(3) > tbody > tr:nth-last-child(3) > td:nth-child(11)').text().split('/')[1];
    
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
        time = dateHelpers.getCurrentTime();

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
            // if (game.last_name === "Korshkov") { console.log(game) };

            // Log All Games
            console.log(game);
        }

        // Cycle Through Yesterdays's Games
        for (game of yesterdaysGames) {
            // Log Specific Game:
            if (game.last_name === "Korshkov") { console.log(game) };
      
            // Log All Games
            // console.log(game);
        }
    }
}

addGames();