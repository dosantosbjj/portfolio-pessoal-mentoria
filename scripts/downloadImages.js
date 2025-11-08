const fs = require('fs');
const https = require('https');
const path = require('path');

const imageUrls = {
  'anderson-silva': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Anderson_Silva_UFC_183.jpg',
  'georges-st-pierre': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Georges_St-Pierre_2.jpg',
  'khabib-nurmagomedov': 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Khabib_Nurmagomedov_in_2019.jpg',
  'jon-jones': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Jon_Jones_after_UFC_235_post_fight_press_conference.jpg',
  'amanda-nunes': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Amanda_Nunes_UFC_232.jpg',
  'conor-mcgregor': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Conor_McGregor_2018.jpg',
  'israel-adesanya': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Israel_Adesanya_UFC_243_Press_Conference.jpg',
  'charles-oliveira': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Charles_Oliveira_UFC_269.jpg',
  'dustin-poirier': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Dustin_Poirier_UFC_264_Press_Conference.jpg',
  'kamaru-usman': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Kamaru_Usman_UFC_235_Press_Conference.jpg'
};

const downloadImage = (url, fileName) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'fighters');
console.log('Output directory:', outputDir);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${fileName}.jpg`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading ${fileName}: ${err.message}`);
      reject(err);
    });
  });
};

async function downloadAllImages() {
  try {
    for (const [fileName, url] of Object.entries(imageUrls)) {
      await downloadImage(url, fileName);
    }
    console.log('All images downloaded successfully');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages();