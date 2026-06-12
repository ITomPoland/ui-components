const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET = import.meta.env.VITE_SANITY_DATASET;
const API_VERSION = 'v2022-03-07';

export async function fetchShowcaseProjects() {
  if (!PROJECT_ID || !DATASET) {
    console.warn('Sanity credentials missing in .env');
    return [];
  }

  // GROQ Query to fetch all showcase projects and format them exactly like the old static data
  const query = encodeURIComponent(`*[_type == "showcaseProject"] | order(_createdAt desc) {
    "name": title,
    url,
    author,
    authorUrl,
    "image": image.asset->url,
    tags,
    socials
  }`);

  const apiUrl = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${query}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response from Sanity was not ok');
    const { result } = await response.json();
    
    // Map Sanity data structure to match what grid.js expects
    return result.map(site => {
      // Convert socials array [{platform: 'x', url: '...'}] to object {x: '...', linkedin: '...'}
      const socialsObj = {};
      if (site.socials && Array.isArray(site.socials)) {
        site.socials.forEach(s => {
          if (s.platform && s.url) {
            socialsObj[s.platform] = s.url;
          }
        });
      }

      return {
        ...site,
        componentsUsed: site.tags || [],
        socials: socialsObj,
        rotation: Math.random() * 4 - 2 // Add a slight random tilt like the old polaroids
      };
    });
  } catch (error) {
    console.error('Error fetching showcase projects from Sanity:', error);
    return [];
  }
}
