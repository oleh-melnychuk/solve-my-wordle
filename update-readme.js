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

console.log('README updated successfully!');
console.log(`5 letters: ${word5.word} (Issue #${word5.issue})`);
console.log(`6 letters: ${word6.word} (Issue #${word6.issue})`);
