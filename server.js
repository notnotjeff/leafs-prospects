var express = require('express');
const path  = require('path');
var fs      = require('fs');
var rp      = require('request-promise');
var cheerio = require('cheerio');
var convert = require('xml-js');
var app     = express();
var backend = require('./prospects.js');

// Get And Set Backend Prospect Array
const prospects = backend.prospects;

app.use(express.static(path.join(__dirname, 'client/build')));

function getAge(dateString)
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
        age--;
    }
    return age;
}

function scrape(prospects) {
  let promises = [];

  prospects.forEach((p, i) => {
    if (p.league === "OHL" || p.league === "AHL" || p.league === "ECHL" || p.league == "WHL") {
      var url = {
        url: p.profile_url,
        json: true
      }
    } else if (p.league === "NCAA" && p.last_name === "Joshua") {
      var url = {
        url: p.profile_url,
        transform: body => cheerio.load(body, { xmlMode: true })
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
                      var ep_url = p.ep_url

                      if (p.league === "OHL") {
                        var goals = data.SiteKit.Player.regular[0].goals;
                        var assists = data.SiteKit.Player.regular[0].assists;
                        var points = data.SiteKit.Player.regular[0].points;
                        var shots = data.SiteKit.Player.regular[0].shots;
                        var games_played = data.SiteKit.Player.regular[0].games_played;
                      } else if (p.league === "WHL") {
                        if (p.player_id === 27355) { // If player is Riley Stotts it means he was traded, add up both team stats
                          var goals = +data.SiteKit.Player.regular[0].goals + +data.SiteKit.Player.regular[1].goals;
                          var assists = +data.SiteKit.Player.regular[0].assists + +data.SiteKit.Player.regular[1].assists;
                          var points = +data.SiteKit.Player.regular[0].points + +data.SiteKit.Player.regular[1].points;
                          var shots = +data.SiteKit.Player.regular[0].shots + +data.SiteKit.Player.regular[1].shots;
                          var games_played = +data.SiteKit.Player.regular[0].games_played + +data.SiteKit.Player.regular[1].games_played;
                        } else {
                          var goals = data.SiteKit.Player.regular[0].goals;
                          var assists = data.SiteKit.Player.regular[0].assists;
                          var points = data.SiteKit.Player.regular[0].points;
                          var shots = data.SiteKit.Player.regular[0].shots;
                          var games_played = data.SiteKit.Player.regular[0].games_played;
                        }
                      } else if (p.league === "QMJHL") {
                        var goals = data.SiteKit.Player.regular[0].goals;
                        var assists = data.SiteKit.Player.regular[0].assists;
                        var points = data.SiteKit.Player.regular[0].points;
                        var shots = data.SiteKit.Player.regular[0].shots;
                        var games_played = data.SiteKit.Player.regular[0].games_played;
                      } else if (p.league === "AHL" || p.league === "ECHL") {
                        data = data.slice(5, data.length-1);
                        data = JSON.parse(data);
                        var goals = data.careerStats[0].sections[0].data[0].row.goals;
                        var assists = data.careerStats[0].sections[0].data[0].row.assists;
                        var points = data.careerStats[0].sections[0].data[0].row.points;
                        var shots = data.careerStats[0].sections[0].data[0].row.shots;
                        var games_played = data.careerStats[0].sections[0].data[0].row.games_played;
                      } else if (p.league === "KHL") {
                        // You Will Have to Change The Row When It's Just Regular Season
                        var goals = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(4)').text();
                        var assists = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(5)').text();
                        var points = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(6)').text();
                        var shots = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(15)').text();
                        var games_played = data('#pl_Stats > tbody > tr:nth-child(4) > td:nth-child(3)').text();
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
                      } else if (p.last_name === "Kara") {
                        var goals = data('.player_stats > tbody > tr:nth-last-of-type(4)').children('td:nth-child(4)').text();
                        var assists = data('.player_stats > tbody > tr:nth-last-of-type(4)').children('td:nth-child(5)').text();
                        var points = data('.player_stats > tbody > tr:nth-last-of-type(4)').children('td:nth-child(6)').text();
                        var shots = data('.player_stats > tbody > tr:nth-last-of-type(4)').children('td:nth-child(15)').text();
                        var games_played = data('.player_stats > tbody > tr:nth-last-of-type(4)').children('td:nth-child(3)').text();
                      } else if (p.last_name === "Chebykin") {
                        var goals = data('.player_stats > tbody > tr:nth-child(8)').children('td:nth-child(3)').text();
                        var assists = data('.player_stats > tbody > tr:nth-child(8)').children('td:nth-child(4)').text();
                        var points = data('.player_stats > tbody > tr:nth-child(8)').children('td:nth-child(5)').text();
                        var shots = data('.player_stats > tbody > tr:nth-child(8)').children('td:nth-child(14)').text();
                        var games_played = data('.player_stats > tbody > tr:nth-child(8)').children('td:nth-child(2)').text();
                      } else if (p.last_name === "Bobylev") {
                        var goals = data('.player_standings .site_table tbody > tr:nth-child(8)').children('td:nth-child(4)').text();
                        var assists = data('.player_standings .site_table tbody > tr:nth-child(8)').children('td:nth-child(5)').text();
                        var points = data('.player_standings .site_table tbody > tr:nth-child(8)').children('td:nth-child(6)').text();
                        var shots = data('.player_standings .site_table tbody > tr:nth-child(8)').children('td:nth-child(15)').text();
                        var games_played = data('.player_standings .site_table tbody > tr:nth-child(8)').children('td:nth-child(3)').text();
                      } else if (p.last_name === "Kizimov") {
                        var goals = data('.player_standings .site_table tbody > tr:nth-child(4)').children('td:nth-child(4)').text();
                        var assists = data('.player_standings .site_table tbody > tr:nth-child(4)').children('td:nth-child(5)').text();
                        var points = data('.player_standings .site_table tbody > tr:nth-child(4)').children('td:nth-child(6)').text();
                        var shots = data('.player_standings .site_table tbody > tr:nth-child(4)').children('td:nth-child(15)').text();
                        var games_played = data('.player_standings .site_table tbody > tr:nth-child(4)').children('td:nth-child(3)').text();
                      } else if (p.league === "NCAA") {
                        // console.log(data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(3)').text());
                        var goals = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(4)').text();
                        var assists = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(5)').text();
                        var points = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(6)').text();
                        var shots = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(10)').text();
                        var games_played = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(2) td:nth-child(3)').text();
                      } else if (p.last_name === "Greenway") {
                        var goals = "";
                        var assists = "";
                        var points = "";
                        var shots = "";
                        var games_played = "";
                      } else if (p.league === "Liiga") {
                        var goals = data('#stats-section > table:nth-child(4) > tbody > tr:nth-last-of-type(3) > td:nth-child(5)').text();
                        var assists = data('#stats-section > table:nth-child(4) > tbody > tr:nth-last-of-type(3) > td:nth-child(6)').text();
                        var points = data('#stats-section > table:nth-child(4) > tbody > tr:nth-last-of-type(3) > td:nth-child(7)').text();
                        var shots = data('#stats-section > table:nth-child(4) > tbody > tr:nth-last-of-type(3) > td:nth-child(15)').text();
                        var games_played = data('#stats-section > table:nth-child(4) > tbody > tr:nth-last-of-type(3) > td:nth-child(4)').text();
                      }

                      if (Number(games_played) !== 0 || Number(games_played) !== NaN) {
                        games_played = Number(games_played);
                        var goals_pg = (goals / games_played).toFixed(2);
                        var assists_pg = (assists / games_played).toFixed(2);
                        var points_pg = (points / games_played).toFixed(2);
                        var shots_pg = (shots / games_played).toFixed(2);
                      } else {
                        var goals_pg = "NA";
                        var assists_pg = "NA";
                        var points_pg = "NA";
                        var shots_pg = "NA";
                      }

                      goals = Number(goals);
                      assists = Number(assists);
                      points = Number(points);
                      games_played = Number(games_played);
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
                        shots_pg
                      };
                    })
                    .catch(err => {
                      console.log(err);
                    })
                  );
  });
  return Promise.all(promises);
}

app.get('/prospects', function(req, res){
  var players = [];

  scrape(prospects)
    .then(data => {
      data.forEach(p => {
        players.push(p);
      });
      res.json(players);
    });
});

app.get('*', (req, res) => {
  res.send('There is nothing here.');
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on port ${port}`);

exports = module.exports = app;

// Fetch Code in Prospects.js when just getting info from API, goes in ComponentDidMount

// fetch('/prospects')
//       .then(res => res.json())
//       .then(prospects => {
//         this.setState({ prospects, originalProspects: prospects });
//       });