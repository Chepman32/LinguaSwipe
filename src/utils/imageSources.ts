type ImageSize = {
  width: number;
  height: number;
};

const DEFAULT_SIZE: ImageSize = { width: 800, height: 600 };

function extractKeywords(url: string) {
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return null;
  const rawQuery = url.slice(queryIndex + 1);
  if (!rawQuery) return null;
  // Deck image URLs may include extra params (e.g., `sig=` for cache stability).
  // Keep only the first (keyword) segment.
  const first = rawQuery.split('&').find((part) => part && !part.startsWith('sig='));
  if (!first) return null;
  return decodeURIComponent(first);
}

function normalizeTags(keywords: string) {
  return keywords
    .split(/[,\s]+/g)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getImageTags(imageUrl: string) {
  const keywords = extractKeywords(imageUrl);
  if (!keywords) return [];
  return normalizeTags(keywords);
}

export function getImageCandidates(imageUrl: string, size: ImageSize = DEFAULT_SIZE) {
  const candidates = [imageUrl];
  const keywords = extractKeywords(imageUrl);
  if (!keywords) return candidates;

  const tags = normalizeTags(keywords);
  if (!tags.length) return candidates;

  const tagSlug = encodeURIComponent(tags.slice(0, 4).join(','));

  // Relevant alternatives for "tap to see more photos" (Tinder-style).
  // Unsplash Source supports cache-busting with `sig`, giving different (still keyword-based) results.
  if (imageUrl.includes('source.unsplash.com')) {
    const sigMatch = imageUrl.match(/[?&]sig=(\d+)/);
    const baseSig = sigMatch ? Number(sigMatch[1]) : 0;
    const stripSig = (url: string) =>
      url.replace(/([?&])sig=\d+&?/g, '$1').replace(/[?&]$/, '');
    const withSig = (url: string, sig: number) => {
      const cleaned = stripSig(url);
      return `${cleaned}${cleaned.includes('?') ? '&' : '?'}sig=${sig % 1000}`;
    };
    candidates.push(withSig(imageUrl, baseSig + 1));
    candidates.push(withSig(imageUrl, baseSig + 2));
  }

  // loremflickr supports `lock` for deterministic (but different) images per keyword set.
  candidates.push(`https://loremflickr.com/${size.width}/${size.height}/${tagSlug}?lock=1`);
  candidates.push(`https://loremflickr.com/${size.width}/${size.height}/${tagSlug}?lock=2`);

  // Keep it stable/deduped for caching.
  return Array.from(new Set(candidates));
}
