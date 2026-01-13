const wordsData = require("./words.json");

// Kyiv time, same logic as your game
function getKyivDateIgnoringGMT(date = new Date()) {
  const kyiv = date.toLocaleString("uk-UA", { timeZone: "Europe/Kiev" });
  const [d, m, y, h, min, s] = kyiv.split(/[\s,.:]+/).map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min, s));
}

function getIssueNumber(firstDay) {
  const today = getKyivDateIgnoringGMT();
  const start = getKyivDateIgnoringGMT(new Date(firstDay));
  return Math.ceil((today - start) / 86400000);
}

function getWordOfTheDay(letters = 6) {
  const edition = wordsData[letters];
  if (!edition) throw new Error("Unsupported letters count");

  let issue = getIssueNumber(edition.firstDay);

  return {
    issue,
    word: edition.words[issue  % edition.words.length]
  };
}
module.exports = {
  getWordOfTheDay
};