const fs = require('fs');
const path = 'public/videos/stacked-slides-app/stacked-slides-app.9f367d21.css';

if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');
  
  // Fix background shorthand with forward slashes
  // Pattern: "center / cover" or "center / 100% 100%" etc.
  content = content.replace(/(\b(?:center|top|bottom|left|right|\d+%?)\s+)\/\s+([^,;)]+)/g, '$1');
  
  // Add background-size separately if needed
  // This is a simplified approach - we'll add background-size for common cases
  content = content.replace(/background:\s*([^;]+center[^;]*no-repeat[^;]*);/g, (match, bg) => {
    if (bg.includes('cover')) {
      return match + '\n  background-size: cover;';
    }
    return match;
  });
  
  fs.writeFileSync(path, content);
  console.log('Fixed CSS file:', path);
} else {
  console.log('CSS file not found:', path);
}

