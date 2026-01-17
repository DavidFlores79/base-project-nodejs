const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'frontend/dist/frontend/browser');
const dest = path.join(__dirname, 'public');

function sync() {
  try {
    if (!fs.existsSync(src)) {
      console.error(`Source directory ${src} does not exist. Run 'npm run build' in frontend first.`);
      process.exit(1);
    }

    console.log('Syncing frontend to public directory...');

    // Remove files in public except uploads
    if (fs.existsSync(dest)) {
      const files = fs.readdirSync(dest);
      for (const file of files) {
        if (file !== 'uploads') {
          const filePath = path.join(dest, file);
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      }
    } else {
      fs.mkdirSync(dest, { recursive: true });
    }

    // Copy files
    fs.cpSync(src, dest, { recursive: true });
    
    // Inject Environment Variables into index.html
    require('dotenv').config();
    const indexHtmlPath = path.join(dest, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
        let content = fs.readFileSync(indexHtmlPath, 'utf8');
        const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
        
        if (content.includes('__GOOGLE_MAPS_API_KEY__')) {
            content = content.replace('__GOOGLE_MAPS_API_KEY__', apiKey);
            fs.writeFileSync(indexHtmlPath, content);
            console.log('Injected GOOGLE_MAPS_API_KEY into index.html');
        } else {
            console.warn('Placeholder __GOOGLE_MAPS_API_KEY__ not found in index.html');
        }
    }

    console.log('Frontend synced successfully!');
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

sync();
