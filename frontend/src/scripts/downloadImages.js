import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fighters = [
  {
    name: 'Anderson Silva',
    url: 'https://static.wikia.nocookie.net/mixedmartialarts/images/c/c3/Anderson_Silva.jpg',
    filename: 'anderson-silva.png'
  },
  {
    name: 'Georges St-Pierre',
    url: 'https://static.wikia.nocookie.net/mixedmartialarts/images/b/b3/Georges_St-Pierre.jpg',
    filename: 'georges-st-pierre.png'
  },
  {
    name: 'Khabib Nurmagomedov',
    url: 'https://static.wikia.nocookie.net/mixedmartialarts/images/6/6d/Khabib_Nurmagomedov.jpg',
    filename: 'khabib-nurmagomedov.png'
  },
  {
    name: 'Jon Jones',
    url: 'https://static.wikia.nocookie.net/mixedmartialarts/images/d/d0/Jon_Jones.jpg',
    filename: 'jon-jones.png'
  },
  {
    name: 'Amanda Nunes',
    url: 'https://static.wikia.nocookie.net/mixedmartialarts/images/e/e5/Amanda_Nunes.jpg',
    filename: 'amanda-nunes.png'
  }
];

const imagesDir = path.join(__dirname, 'public', 'images', 'fighters');

// Ensure the images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, filename) {
  const filePath = path.join(imagesDir, filename);
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        response.resume();
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Downloading images to:', imagesDir);
  
  for (const fighter of fighters) {
    try {
      await downloadImage(fighter.url, fighter.filename);
    } catch (error) {
      console.error(`Failed to download ${fighter.filename}:`, error.message);
    }
  }
}

downloadAllImages();