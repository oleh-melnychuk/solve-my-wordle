const fs = require('fs');
const { getWordOfTheDay } = require('./index.js');

// Get words of the day
const word5 = getWordOfTheDay(5);
const word6 = getWordOfTheDay(6);
const today = new Date().toISOString().split('T')[0];

// Read the current README
const readmePath = './README.md';
let readme = fs.readFileSync(readmePath, 'utf8');

// Update the README content - use multiline regex with dotall flag equivalent
readme = readme.replace(
  /### 5 Letters[\s\S]*?\*\*Word:\*\* [^\n]+/,
  `### 5 Letters\n**Word:** ${word5.word} (Issue #${word5.issue})`
);

readme = readme.replace(
  /### 6 Letters[\s\S]*?\*\*Word:\*\* [^\n]+/,
  `### 6 Letters\n**Word:** ${word6.word} (Issue #${word6.issue})`
);

// Update the last updated date
readme = readme.replace(
  /\*Last updated: [^\n]+/,
  `*Last updated: ${today}*`
);

// Write the updated README
fs.writeFileSync(readmePath, readme, 'utf8');

// Read the HTML template
const htmlPath = './index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Update the HTML content
html = html.replace(
  /<div class="word-value" id="word5">[^<]+<\/div>/,
  `<div class="word-value" id="word5">${word5.word}</div>`
);

html = html.replace(
  /<div class="word-issue" id="issue5">[^<]+<\/div>/,
  `<div class="word-issue" id="issue5">Issue #${word5.issue}</div>`
);

html = html.replace(
  /<div class="word-value" id="word6">[^<]+<\/div>/,
  `<div class="word-value" id="word6">${word6.word}</div>`
);

html = html.replace(
  /<div class="word-issue" id="issue6">[^<]+<\/div>/,
  `<div class="word-issue" id="issue6">Issue #${word6.issue}</div>`
);

html = html.replace(
  /<div class="date-value" id="date">[^<]+<\/div>/,
  `<div class="date-value" id="date">${today}</div>`
);

// Write the updated HTML
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('README and HTML updated successfully!');
console.log(`5 letters: ${word5.word} (Issue #${word5.issue})`);
console.log(`6 letters: ${word6.word} (Issue #${word6.issue})`);
