import { imageUrls, defaultFighterSilhouette } from './defaultImages';

// Convert a remote image URL to base64
async function getBase64FromUrl(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

// Get image for a fighter, converting remote URL to base64 if needed
export async function getFighterImage(fighterName) {
  try {
    // Check if we have a URL for this fighter
    const imageUrl = imageUrls[fighterName];
    if (!imageUrl) {
      return defaultFighterSilhouette;
    }

    // Convert the image to base64
    const base64Image = await getBase64FromUrl(imageUrl);
    return base64Image || defaultFighterSilhouette;
  } catch (error) {
    console.error('Error loading fighter image:', error);
    return defaultFighterSilhouette;
  }
}

// Cache to store converted images
const imageCache = new Map();

// Get image with caching for better performance
export async function getCachedFighterImage(fighterName) {
  if (imageCache.has(fighterName)) {
    return imageCache.get(fighterName);
  }

  const image = await getFighterImage(fighterName);
  imageCache.set(fighterName, image);
  return image;
}

// Preload all fighter images into cache
export async function preloadFighterImages() {
  const fighters = Object.keys(imageUrls);
  await Promise.all(
    fighters.map(async (fighter) => {
      await getCachedFighterImage(fighter);
    })
  );
}