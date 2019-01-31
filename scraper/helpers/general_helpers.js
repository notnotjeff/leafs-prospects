// Get age of player from todays date
module.exports.getAge = function (dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today - birthDate;
    return Math.floor(age/31557600000*10) / 10;
}

// Get current season
module.exports.getCurrentSeason = function () {
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