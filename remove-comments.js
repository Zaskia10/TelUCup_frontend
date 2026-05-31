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
    content = content.replace(/(?<!:)\/\/.*$/gm, '');
    
    // Clean up empty lines that might have been left
    content = content.replace(/^\s*[\r\n]/gm, '');

    fs.writeFileSync(fullPath, content);
  }
});
console.log('Comments removed.');
