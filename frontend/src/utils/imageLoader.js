import { imageUrls, defaultFighterSilhouette } from './defaultImages';

// Get image URL for a fighter
export function getFighterImage(fighter) {
  try {
    if (!fighter || !fighter.name) {
      console.error('Invalid fighter object:', fighter);
      return defaultFighterSilhouette;
    }

    // 1) If user uploaded base64 image, use it
    if (fighter.image && fighter.image.startsWith('data:image')) {
      return fighter.image;
    }

    // Normalize and split into words (take first two words)
    const words = fighter.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z\s-]/g, '') // keep letters, spaces and hyphens
      .trim()
      .split(/\s+/)
      .slice(0, 2);

    // Build candidate filename variants
    const candidates = new Set();

  // also remove internal hyphens inside tokens (e.g., 'st-pierre' -> 'stpierre')
  const cleanedTokens = words.map((w) => w.replace(/-/g, ''));
  // Prefer cleaned tokens (e.g., georges-stpierre) first
  candidates.add(cleanedTokens.join('-'));
  candidates.add(cleanedTokens.join(''));
  // then try the straightforward variants with hyphen and without
  const joinHyphen = words.join('-');
  const joinNoHyphen = words.join('');
  candidates.add(joinHyphen);
  candidates.add(joinNoHyphen);

    // for names like 'georges st pierre' (3 words), try first and last
    const fullWords = fighter.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s-]/g, '')
      .trim()
      .split(/\s+/);
    if (fullWords.length >= 3) {
      const firstAndLast = [fullWords[0], fullWords[fullWords.length - 1]];
      candidates.add(firstAndLast.join('-'));
      candidates.add(firstAndLast.join(''));
    }

    // Try png and jpg extensions
    const extensions = ['png', 'jpg', 'jpeg'];
    for (const nameVariant of candidates) {
      for (const ext of extensions) {
        const path = `/images/fighters/${nameVariant}.${ext}`;
        // We can't check file existence on the client synchronously here,
        // but returning the path is fine — the browser will request it and fallback if 404.
        // Prioritize PNG first by checking order above.
        // Return the first candidate path (prefer png then jpg)
        if (ext === 'png') {
          // prefer png variant: return immediately
          console.log(`Trying image path (png preferred): ${path}`);
          return path;
        }
      }
    }

    // Fallback to default silhouette
    return defaultFighterSilhouette;
  } catch (error) {
    console.error('Error getting fighter image:', error);
    return defaultFighterSilhouette;
  }
}

// Get cached image path (no need for actual caching since we're using local files)
export function getCachedFighterImage(fighter) {
  return getFighterImage(fighter);
}

// No need for preloading since we're using local files
export function preloadFighterImages() {
  return Promise.resolve();
}