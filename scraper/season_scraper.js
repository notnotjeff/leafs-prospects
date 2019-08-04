// Use 'node scraper/season_scraper.js' to run script

const rp = require('request-promise');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const backend = require('./prospects.js');

const dateHelpers = require('./helpers/date_helpers.js');
const generalHelpers = require('./helpers/general_helpers.js');

const chlScraper = require('./league_scrapers/chl_scraper.js');
const ahlScraper = require('./league_scrapers/ahl_scraper.js');
const ushlScraper = require('./league_scrapers/ushl_scraper.js');
const echlScraper = require('./league_scrapers/echl_scraper.js');
const khlScraper = require('./league_scrapers/khl_scraper.js');
const shlScraper = require('./league_scrapers/shl_scraper.js');
const vhlScraper = require('./league_scrapers/vhl_scraper.js');
const ncaaScraper = require('./league_scrapers/ncaa_scraper.js');
const liigaScraper = require('./league_scrapers/liiga_scraper.js');
const mestisScraper = require('./league_scrapers/mestis_scraper.js');

dotenv.config();
const TESTING_MODE = false;

admin.initializeApp({
  credential: admin.credential.cert({
    private_key: process.env.FIREBASE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_EMAIL,
    project_id: 'leafs-prospects',
  }),
  databaseURL: 'https://leafs-prospects.firebaseio.com',
});

// Get And Set Backend Prospect Array
const prospectDB = backend.prospects;

// SCRAPING FUNCTION
function scrape(prospects) {
  const promises = [];

  prospects.forEach((p, _i) => {
    let urlData = {};
    if (
      p.league === 'OHL'
      || p.league === 'AHL'
      || p.league === 'ECHL'
      || p.league === 'WHL'
      || p.league === 'USHL'
      || p.league === 'QMJHL'
      || p.league === 'Mestis'
    ) {
      urlData = {
        url: p.profile_url,
        json: true,
      };
    } else {
      urlData = {
        url: p.profile_url,
        transform: body => cheerio.load(body),
      };
    }

    promises.push(
      rp(urlData)
        .then((data) => {
          const {
            first_name,
            last_name,
            league,
            position,
            shoots,
            ep_url,
            round,
            draft_year,
            pick,
          } = p;

          const age = generalHelpers.getAge(p.dob);

          let goals = 0;
          let assists = 0;
          let points = 0;
          let shots = 0;
          let games_played = 0;

          // eslint-disable-next-line no-console
          console.log(p.last_name);

          if (p.league === 'OHL') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = chlScraper.seasonScrape(
              data.SiteKit.Player.regular,
              data.SiteKit.Player.regular[0].season_id,
            );
          } else if (p.league === 'WHL') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = chlScraper.seasonScrape(
              data.SiteKit.Player.regular,
              data.SiteKit.Player.regular[0].season_id,
            );
          } else if (p.league === 'QMJHL') {
            const parsedData = JSON.parse(data.substr(5, data.length - 6));
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = chlScraper.seasonScrape(
              parsedData.SiteKit.Teamstat.seasons.regular,
              parsedData.SiteKit.Teamstat.seasons.regular[0].season_id,
            );
          } else if (p.league === 'AHL') {
            const parsedData = JSON.parse(data.slice(5, data.length - 1));
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = ahlScraper.seasonScrape(
              parsedData.careerStats[0].sections[0].data,
              generalHelpers.getCurrentSeason(),
            );
          } else if (p.league === 'USHL') {
            const parsedData = JSON.parse(data.slice(5, data.length - 1));
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = ushlScraper.seasonScrape(
              parsedData.careerStats[0].sections[0].data,
              generalHelpers.getCurrentSeason(),
            );
          } else if (p.league === 'ECHL') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = echlScraper.seasonScrape(
              data.data.stats.history,
              generalHelpers.getCurrentSeason(),
            );
          } else if (p.league === 'KHL') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = khlScraper.seasonScrape(data);
          } else if (p.league === 'SHL') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = shlScraper.seasonScrape(data);
          } else if (p.league === 'VHL') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = vhlScraper.seasonScrape(data);
          } else if (p.league === 'NCAA') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = ncaaScraper.seasonScrape(data);
          } else if (p.league === 'Liiga') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = liigaScraper.seasonScrape(data);
          } else if (p.league === 'Mestis') {
            [
              goals,
              assists,
              points,
              shots,
              games_played,
            ] = mestisScraper.seasonScrape(data);
          }

          let goals_pg = null;
          let assists_pg = null;
          let points_pg = null;
          let shots_pg = null;

          if (Number(games_played) > 0) {
            games_played = Number(games_played);
            goals_pg = (goals / games_played).toFixed(2);
            assists_pg = (assists / games_played).toFixed(2);
            points_pg = (points / games_played).toFixed(2);
            shots_pg = (shots / games_played).toFixed(2);
          } else {
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
            pick,
          };
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        }),
    );
  });
  return Promise.all(promises);
}

async function updateDB() {
  // eslint-disable-next-line no-console
  console.log('Starting Scrape');
  const prospectData = await scrape(prospectDB);
  // eslint-disable-next-line no-console
  console.log('Completed Scrape');

  if (!TESTING_MODE) {
    // Set Time
    const time = dateHelpers.getCurrentTime();

    const allTransactionPromises = [];
    const prospectsRef = admin.database().ref('prospects');
    const ranAtRef = admin.database().ref('prospectsScrapedTime');
    prospectsRef.set({});
    ranAtRef.set({});

    allTransactionPromises.push(ranAtRef.push({ updatedAt: time }));

    prospectData.forEach((prospect) => {
      // console.log(prospect)
      const transactionPromise = prospectsRef.push(prospect);
      allTransactionPromises.push(transactionPromise);
    });

    await Promise.all(allTransactionPromises);
    // eslint-disable-next-line no-console
    console.log('Shutting Down DB Ref');
    admin.app().delete();
  } else {
    prospectData.forEach((prospect) => {
      // Log Specific Prospect:
      if (prospect.last_name === 'Piccinich') {
        // eslint-disable-next-line no-console
        console.log(prospect);
      }

      // Log All Prospects
      // console.log(prospect);
    });
  }
}

updateDB();
