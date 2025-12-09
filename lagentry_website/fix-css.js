const fs = require('fs');
const path = require('path');

// Recursively find all CSS files
function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Fix all CSS files that might have forward slash issues
const cssFiles = [
  'public/videos/stacked-slides-app/stacked-slides-app.9f367d21.css'
];

// Add all CSS files from src directory
if (fs.existsSync('src')) {
  cssFiles.push(...findCssFiles('src'));
}

cssFiles.forEach(path => {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    let modified = false;
    
    // Fix background shorthand with forward slashes
    // Pattern: "center / cover" or "center / 100% 100%" etc.
    const beforeBg = content;
    content = content.replace(/(\b(?:center|top|bottom|left|right|\d+%?)\s+)\/\s+([^,;)]+)/g, '$1');
    if (content !== beforeBg) modified = true;
    
    // Convert aspect-ratio fractions to decimal format to avoid forward slash issues
    // This is a workaround for CSS minifiers that have issues with forward slashes
    const beforeAspect = content;
    content = content.replace(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)\s*;/g, (match, num1, num2) => {
      const decimal = (parseInt(num1) / parseInt(num2)).toFixed(6).replace(/\.?0+$/, '');
      return `aspect-ratio: ${decimal};`;
    });
    if (content !== beforeAspect) modified = true;
    
    // Fix invalid aspect-ratio values (like "aspect-ratio: 16;" should be converted to decimal)
    const beforeAspectSingle = content;
    content = content.replace(/aspect-ratio:\s*(\d+)\s*;/g, (match, num) => {
      // Common aspect ratios: 16 -> 1.777778 (16/9), 4 -> 1.333333 (4/3), 1 -> 1 (1/1)
      if (num === '16') return 'aspect-ratio: 1.777778;'; // 16/9
      if (num === '4') return 'aspect-ratio: 1.333333;'; // 4/3
      if (num === '1') return 'aspect-ratio: 1;'; // 1/1
      return match;
    });
    if (content !== beforeAspectSingle) modified = true;
    
    // Add background-size separately if needed
    const beforeBgSize = content;
    content = content.replace(/background:\s*([^;]+center[^;]*no-repeat[^;]*);/g, (match, bg) => {
      if (bg.includes('cover')) {
        return match + '\n  background-size: cover;';
      }
      return match;
    });
    if (content !== beforeBgSize) modified = true;
    
    if (modified) {
      fs.writeFileSync(path, content);
      console.log('Fixed CSS file:', path);
    }
  }
});

