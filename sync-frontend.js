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
    console.log('Frontend synced successfully!');
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

sync();
