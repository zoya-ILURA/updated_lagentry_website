const fs = require('fs');
const path = require('path');

// Recursively find all CSS files
function findCssFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findCssFiles(filePath, fileList);
        } else if (file.endsWith('.css')) {
          fileList.push(filePath);
        }
      } catch (e) {
        // Skip files we can't access
      }
    });
  } catch (e) {
    // Skip directories we can't access
  }
  return fileList;
}

// Fix all CSS files that might have forward slash issues
const cssFiles = [];

// Add the problematic file in public
const publicCssFile = path.join('public', 'videos', 'stacked-slides-app', 'stacked-slides-app.9f367d21.css');
if (fs.existsSync(publicCssFile)) {
  cssFiles.push(publicCssFile);
}

// Add all CSS files from src directory
if (fs.existsSync('src')) {
  cssFiles.push(...findCssFiles('src'));
}

console.log(`Found ${cssFiles.length} CSS files to check`);

cssFiles.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix background shorthand with forward slashes
      // Pattern: "center / cover" or "center / 100% 100%" etc.
      // But ONLY in background properties, NOT in URLs, @import, or comments
      // Use a more specific pattern that only matches background properties
      content = content.replace(/background(?:-image|-position|-size)?:\s*([^;]*?)(\b(?:center|top|bottom|left|right|\d+%?)\s+)\/\s+([^,;)]+)([^;]*);/g, (match, before, pos, size, after) => {
        // Only remove the forward slash if it's NOT in a url() function
        if (!match.includes('url(')) {
          return `background${match.includes('-image') ? '-image' : match.includes('-position') ? '-position' : match.includes('-size') ? '-size' : ''}: ${before}${pos}${after};`;
        }
        return match;
      });
      
      // Convert ALL aspect-ratio fractions to decimal format to avoid forward slash issues
      // This is a workaround for CSS minifiers that have issues with forward slashes
      content = content.replace(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)\s*;/g, (match, num1, num2) => {
        const decimal = (parseInt(num1) / parseInt(num2)).toFixed(6).replace(/\.?0+$/, '');
        return `aspect-ratio: ${decimal};`;
      });
      
      // Fix single number aspect-ratio values (convert to decimal if needed)
      content = content.replace(/aspect-ratio:\s*(\d+)\s*;/g, (match, num) => {
        // Common aspect ratios: 16 -> 1.777778 (16/9), 4 -> 1.333333 (4/3), 1 -> 1 (1/1)
        if (num === '16') return 'aspect-ratio: 1.777778;'; // 16/9
        if (num === '4') return 'aspect-ratio: 1.333333;'; // 4/3
        if (num === '1') return 'aspect-ratio: 1;'; // 1/1 (square)
        return match;
      });
      
      // Don't remove forward slashes from URLs - they're needed there
      // The previous fixes should have handled all the problematic cases
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed CSS file:', filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('CSS fix script completed');

