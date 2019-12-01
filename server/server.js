var express = require("express");
const path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.send("There is nothing here.");
});

const port = process.env.PORT || 5000;
app.listen(port);
// eslint-disable-next-line no-console
console.log(`Server listening on port ${port}`);

exports = module.exports = app;
