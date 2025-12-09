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

const cssFiles = [];
const publicCssFile = path.join('public', 'videos', 'stacked-slides-app', 'stacked-slides-app.9f367d21.css');
if (fs.existsSync(publicCssFile)) {
  cssFiles.push(publicCssFile);
}
if (fs.existsSync('src')) {
  cssFiles.push(...findCssFiles('src'));
}

console.log(`Found ${cssFiles.length} CSS files to check`);

let fixedCount = 0;
let checkedCount = 0;

cssFiles.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      checkedCount++;
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix broken @import URLs
      content = content.replace(/@import\s+url\(['"]https:\/;([^'"]+)['"]\);/g, (match, params) => {
        if (params.includes('400;500;600;700') && params.includes('&display=swap')) {
          return `@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');`;
        }
        if (params.includes('400;500;600;700;800;900') && params.includes('&display=swap')) {
          return `@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');`;
        }
        return match;
      });
      
      // Convert aspect-ratio fractions to decimals
      content = content.replace(/aspect-ratio:\s*(\d+)\s*\/\s*(\d+)\s*;/g, (match, num1, num2) => {
        const decimal = (parseInt(num1) / parseInt(num2)).toFixed(6).replace(/\.?0+$/, '');
        return `aspect-ratio: ${decimal};`;
      });
      
      // AGGRESSIVE FIX: Remove ALL forward slashes from background shorthand
      // This handles patterns like "center / cover", "0 0 / 100%", etc.
      // Process line by line to better handle context
      const lines = content.split('\n');
      const fixedLines = lines.map((line, lineIndex) => {
        // Skip comments
        if (line.trim().startsWith('/*') || line.trim().startsWith('*')) {
          return line;
        }
        
        // Skip @import lines
        if (line.includes('@import')) {
          return line;
        }
        
        // Fix background properties with forward slashes
        // Pattern: background: ... position / size ...
        if (line.includes('background') && line.includes(' / ')) {
          // Check if it's inside a url()
          if (!line.includes('url(') || (line.indexOf('url(') > line.lastIndexOf(' / '))) {
            // Remove the forward slash and size part
            line = line.replace(/(\b(?:center|top|bottom|left|right|\d+(?:px|%|em|rem)?)\s+)\/\s+([a-zA-Z-]+|\d+(?:px|%|em|rem)?)/g, '$1');
          }
        }
        
        return line;
      });
      
      content = fixedLines.join('\n');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed: ${filePath}`);
        fixedCount++;
      }
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\nCSS fix script completed: Checked ${checkedCount} files, Fixed ${fixedCount} files`);
