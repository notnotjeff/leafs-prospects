var Twit        = require('twit');
var dotenv      = require('dotenv');
var htmlToImage = require('html-to-image');
var admin       = require('firebase-admin');

dotenv.config();

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

admin.initializeApp({
  credential: admin.credential.cert({
      "private_key": process.env.FIREBASE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_EMAIL,
      "project_id": "leafs-prospects"
  }),
  databaseURL: "https://leafs-prospects.firebaseio.com"
});

let prospectRows = []
const todaysRef = admin.database().ref('todaysGames');

todaysRef.on("value", function(snapshot) {
  const prospects = snapshot.val();
  const keys = Object.keys(prospects);

  for (const key of keys) {
    prospectRows.push(`
      <tr>
        <td className="last_name">${prospects[key].fullName}</td>
        <td>${prospects[key].league}</td>
        <td>${prospects[key].shots}</td>
        <td>${prospects[key].goals}</td>
        <td>${prospects[key].assists}</td>
        <td>${prospects[key].points}</td>
        <td>${prospects[key].penaltyMinutes}</td>
      </tr>
    `)
  }

  let prospectTable = `
    <table>
      <thead>
        <tr>
          <th className="last_name">Name</th>
          <th>League</th>
          <th>S</th>
          <th>G</th>
          <th>A</th>
          <th>P</th>
          <th>PIM</th>
        </tr>
      </thead>
      <tbody>
        ${prospectRows.join()}
      </tbody>
    </table>
  `

  console.log(prospectTable);

  htmlToImage.toPng(prospectTable)
  .then(function (_dataUrl) {
    // download(dataUrl, 'my-node.png');
  });


  admin.app().delete();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

console.log(prospectRows)
console.log(T)

// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data)
// })