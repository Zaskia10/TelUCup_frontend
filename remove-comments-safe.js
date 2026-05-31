const fs = require('fs');
const path = require('path');

const files = [
  'src/components/bracket/AdminBracketFilter.tsx',
  'src/components/bracket/AdminMatchCard.tsx',
  'src/components/bracket/BracketFilter.tsx',
  'src/components/bracket/ChampionsBanner.tsx',
  'src/components/bracket/MatchDetailModal.tsx',
  'src/components/bracket/MatchEditPanel.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove multi-line jsx comments {/* ... */}
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // Remove multi-line comments /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove single line comments // ... but not inside URLs like http://
    // and not if they are part of a JSX attribute string (approximation: just matching // at start of line or after spaces)
    content = content.replace(/^[ \t]*\/\/.*$/gm, '');
    
    fs.writeFileSync(fullPath, content);
  }
});
console.log('Comments removed again safely.');
