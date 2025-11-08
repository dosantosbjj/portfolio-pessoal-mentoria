// Default fighter silhouette as fallback
const defaultFighterSilhouette = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiLz48L3N2Zz4=';

// Local file paths for fighter images
const imageUrls = {
  'Anderson Silva': '/images/fighters/anderson-silva.png',
  'Georges St-Pierre': '/images/fighters/georges-stpierre.png',
  'Khabib Nurmagomedov': '/images/fighters/khabib-nurmagomedov.png',
  'Jon Jones': '/images/fighters/jon-jones.png',
  'Amanda Nunes': '/images/fighters/amanda-nunes.png',
  'Conor McGregor': '/images/fighters/conor-mcgregor.png',
  'Israel Adesanya': '/images/fighters/israel-adesanya.png',
  'Charles Oliveira': '/images/fighters/charles-oliveira.png',
  'Dustin Poirier': '/images/fighters/dustin-poirier.png',
  'Kamaru Usman': '/images/fighters/kamaru-usman.png'
};

// Function to get image path for a fighter
const getFighterImage = (fighterName) => {
  return imageUrls[fighterName] || defaultFighterSilhouette;
};

// Remove any path-specific characters from image paths
const processImagePath = (path) => {
  return path.replace(/^\//, ''); // Remove leading slash
};

module.exports = {
  defaultFighterSilhouette,
  getFighterImage,
  imageUrls,
  processImagePath
};