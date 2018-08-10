// Initialize Firebase
import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDF4dlLgWelez92pEEh6yemAbLd9-B4QkY",
    authDomain: "leaf-aggregator.firebaseapp.com",
    databaseURL: "https://leaf-aggregator.firebaseio.com",
    projectId: "leaf-aggregator",
    storageBucket: "leaf-aggregator.appspot.com",
    messagingSenderId: "454209898947"
};
firebase.initializeApp(config);
export default firebase;

var rp      = require('request-promise');
var cheerio = require('cheerio');

prospects = [
  {
    first_name: "Fedor",
    last_name: "Gordeev",
    position: "D",
    shoots: "L",
    dob: "1999-01-27",
    player_id: 7146,
    profile_url: "http://cluster.leaguestat.com/feed/?feed=modulekit&view=player&key=f109cf290fcf50d4&fmt=json&client_code=ohl&lang=en&player_id=7146&category=seasonstats",
    league: "OHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=273797"
  },
  {
    first_name: "Eemeli",
    last_name: "Rasanen",
    position: "D",
    shoots: "R",
    dob: "1999-03-06",
    player_id: 7308,
    profile_url: "http://cluster.leaguestat.com/feed/?feed=modulekit&view=player&key=f109cf290fcf50d4&fmt=json&client_code=ohl&lang=en&player_id=7308&category=seasonstats",
    league: "OHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=302228"
  },
  {
    first_name: "Ryan",
    last_name: "McGregor",
    position: "C",
    shoots: "L",
    dob: "1999-01-29",
    player_id: 7117,
    profile_url: "http://cluster.leaguestat.com/feed/?feed=modulekit&view=player&key=f109cf290fcf50d4&fmt=json&client_code=ohl&lang=en&player_id=7117&category=seasonstats",
    league: "OHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=289231"
  },
  {
    first_name: "Timothy",
    last_name: "Liljegren",
    position: "D",
    shoots: "R",
    dob: "1999-04-20",
    player_id: 6893,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6893&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=224910"
  },
  {
    first_name: "Andreas",
    last_name: "Johnsson",
    position: "LW",
    shoots: "L",
    dob: "1994-11-21",
    player_id: 6382,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6382&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=43991"
  },
  {
    first_name: "Jeremy",
    last_name: "Bracco",
    position: "RW",
    shoots: "R",
    dob: "1997-03-17",
    player_id: 6891,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6891&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=197800"
  },
  {
    first_name: "Adam",
    last_name: "Brooks",
    position: "C",
    shoots: "L",
    dob: "1996-05-06",
    player_id: 6888,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6888&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=120202"
  },
  {
    first_name: "Dmytro",
    last_name: "Timashov",
    position: "LW",
    shoots: "L",
    dob: "1996-10-01",
    player_id: 6445,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6445&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=115161"
  },
  {
    first_name: "Kasperi",
    last_name: "Kapanen",
    position: "RW",
    shoots: "R",
    dob: "1996-07-23",
    player_id: 5902,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=5902&season_id=&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=92226"
  },
  {
    first_name: "Travis",
    last_name: "Dermott",
    position: "D",
    shoots: "L",
    dob: "1996-12-22",
    player_id: 6381,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6381&season_id=&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=214673"
  },
  {
    first_name: "Andrew",
    last_name: "Nielsen",
    position: "D",
    shoots: "L",
    dob: "1996-11-13",
    player_id: 6296,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6296&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=131262"
  },
  {
    first_name: "Calle",
    last_name: "Rosen",
    position: "D",
    shoots: "L",
    dob: "1994-02-02",
    player_id: 6917,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6917&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=37021"
  },
  {
    first_name: "Frederik",
    last_name: "Gauthier",
    position: "C",
    shoots: "L",
    dob: "1995-04-26",
    player_id: 5585,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=5585&season_id=&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=128500"
  },
  {
    first_name: "Andreas",
    last_name: "Borgman",
    position: "D",
    shoots: "L",
    dob: "1995-06-18",
    player_id: 6966,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6966&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=85683"
  },
  {
    first_name: "Miro",
    last_name: "Aaltonen",
    position: "C",
    shoots: "L",
    dob: "1993-06-07",
    player_id: 6892,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=6892&season_id=57&site_id=1&key=50c2cd9b5e18e390&client_code=ahl&league_id=&lang=en&statsType=standard&callback=json",
    league: "AHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=44162"
  },
  {
    first_name: "Martin",
    last_name: "Dzierkals",
    position: "LW",
    shoots: "L",
    dob: "1997-04-04",
    player_id: 7331,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=7331&season_id=44&site_id=1&key=e18cfddba0db3b21&client_code=echl&league_id=&lang=en&statsType=standard&callback=json",
    league: "ECHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=239362"
  },
  {
    first_name: "J.J.",
    last_name: "Piccinich",
    position: "RW",
    shoots: "R",
    dob: "1996-06-12",
    player_id: 7137,
    profile_url: "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=player&player_id=7137&season_id=43&site_id=1&key=e18cfddba0db3b21&client_code=echl&league_id=&lang=en&statsType=standard&callback=json",
    league: "ECHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=191113"
  },
  {
    first_name: "Yegor",
    last_name: "Korshkov",
    position: "RW",
    shoots: "L",
    dob: "1996-07-10",
    player_id: 20766,
    profile_url: "https://en.khl.ru/players/20766/",
    league: "KHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=176637"
  },
  {
    first_name: "Carl",
    last_name: "Grundstrom",
    position: "LW",
    shoots: "L",
    dob: "1997-12-01",
    player_id: 0,
    profile_url: "https://www.shl.se/lag/087a-087aTQv9u__frolunda-hc/qQ9-3230HHhqE__carl-grundstrom/statistics",
    league: "SHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=113516"
  },
  {
    first_name: "Pierre",
    last_name: "Engvall",
    position: "LW/RW",
    shoots: "L",
    dob: "1996-05-31",
    player_id: 0,
    profile_url: "https://www.shl.se/lag/3db0-3db09jXTE__hv71/qRh-1LnWA7ztX__pierre-engvall/statistics",
    league: "SHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=147720"
  },
  {
    first_name: "Vladislav",
    last_name: "Kara",
    position: "C",
    shoots: "L",
    dob: "1998-04-20",
    player_id: 22888,
    profile_url: "http://www.vhlru.ru/en/players/22888/#c",
    league: "VHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=322627"
  },
  {
    first_name: "Nikolai",
    last_name: "Chebykin",
    position: "LW/RW",
    shoots: "L",
    dob: "1997-08-01",
    player_id: 22161,
    profile_url: "http://www.vhlru.ru/en/players/22161/#c",
    league: "VHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=300931"
  },
  {
    first_name: "Vladimir",
    last_name: "Bobylev",
    position: "LW/RW",
    shoots: "L",
    dob: "1997-04-18",
    player_id: 21313,
    profile_url: "https://engmhl.khl.ru/players/21313/",
    league: "VHL",
    ep_url: "http://www.eliteprospects.com/player.php?player=268059"
  },
  {
    first_name: "Dakota",
    last_name: "Joshua",
    position: "C",
    shoots: "L",
    dob: "1996-05-15",
    player_id: 29891,
    profile_url: "https://www.collegehockeynews.com/players/career/Dakota-Joshua/29891",
    league: "NCAA",
    ep_url: "http://www.eliteprospects.com/player.php?player=194948"
  },
  {
    first_name: "James",
    last_name: "Greenway",
    position: "D",
    shoots: "L",
    dob: "1998-04-27",
    player_id: 31877,
    profile_url: "https://www.collegehockeynews.com/players/career/JD-Greenway/31877",
    league: "NCAA",
    ep_url: "http://www.eliteprospects.com/player.php?player=226438"
  },
  {
    first_name: "Jesper",
    last_name: "Lindgren",
    position: "D",
    shoots: "R",
    dob: "1997-05-19",
    player_id: 100025980,
    profile_url: "http://liiga.fi/pelaajat/100025980/lindgren-jesper",
    league: "Liiga",
    ep_url: "http://www.eliteprospects.com/player.php?player=187806"
  }
]

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
    if (p.league === "OHL" || p.league === "AHL" || p.league === "ECHL") {
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
                      } else if (p.league === "NCAA") {
                        // console.log(data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(3)').text());
                        var goals = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(4)').text();
                        var assists = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(5)').text();
                        var points = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(6)').text();
                        var shots = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(10)').text();
                        var games_played = data('#content > div:nth-child(4) > table tbody tr:nth-last-of-type(1) td:nth-child(3)').text();
                      } else if (p.last_name === "Greenway") {
                        console.log(data);
                        var goals = "";
                        var assists = "";
                        var points = "";
                        var shots = "";
                        var games_played = "";
                      } else if (p.league === "Liiga") {
                        var goals = data('#stats-section > table:nth-child(2) > tbody > tr > td:nth-child(5)').text();
                        var assists = data('#stats-section > table:nth-child(2) > tbody > tr > td:nth-child(6)').text();
                        var points = data('#stats-section > table:nth-child(2) > tbody > tr > td:nth-child(7)').text();
                        var shots = data('#stats-section > table:nth-child(2) > tbody > tr > td:nth-child(15)').text();
                        var games_played = data('#stats-section > table:nth-child(2) > tbody > tr > td:nth-child(4)').text();
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


scrape()
  .then(prospectData => {
    const prospectsRef = firebase.database().ref('prospects');
    prospectsRef.set({});
    for (var prospect of prospectData) {
      prospectsRef.push(prospect);
    }
  });


