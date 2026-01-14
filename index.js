const wordsData = require("./words.json");

// Kyiv time, same logic as your game
function getKyivDateIgnoringGMT(date = new Date()) {
  // Use Intl.DateTimeFormat to get Kyiv date components
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Kiev',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year').value);
  const month = parseInt(parts.find(p => p.type === 'month').value) - 1; // 0-indexed
  const day = parseInt(parts.find(p => p.type === 'day').value);
  
  // Return date at midnight Kyiv time (start of day)
  return new Date(Date.UTC(year, month, day, 0, 0, 0));
}

function getIssueNumber(firstDay) {
  const today = getKyivDateIgnoringGMT();
  const start = getKyivDateIgnoringGMT(new Date(firstDay));
  const dayInMilliseconds = 86400000;
  const diff = (today - start) / dayInMilliseconds;
  // Use Math.floor + 1 because:
  // - Day 0 (firstDay) should be issue 1
  // - Day 1 should be issue 2, etc.
  const issue = Math.floor(diff) + 1;
  
  return issue;
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