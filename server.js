var express = require('express');
const path  = require('path');
var fs      = require('fs');
var rp      = require('request-promise');
var cheerio = require('cheerio');
var convert = require('xml-js');
var app     = express();
var backend = require('./scraper/prospects.js');

// Get And Set Backend Prospect Array
const prospects = backend.prospects;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.send('There is nothing here.');
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on port ${port}`);

exports = module.exports = app;