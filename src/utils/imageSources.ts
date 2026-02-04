type ImageSize = {
  width: number;
  height: number;
};

const DEFAULT_SIZE: ImageSize = { width: 400, height: 300 };

function extractKeywords(url: string) {
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return null;
  const rawQuery = url.slice(queryIndex + 1);
  if (!rawQuery) return null;
  return decodeURIComponent(rawQuery);
}

function normalizeTags(keywords: string) {
  return keywords
    .split(/[,\s]+/g)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function getImageCandidates(imageUrl: string, size: ImageSize = DEFAULT_SIZE) {
  const candidates = [imageUrl];
  const keywords = extractKeywords(imageUrl);
  if (!keywords) return candidates;

  const tags = normalizeTags(keywords);
  if (!tags.length) return candidates;

  const tagSlug = encodeURIComponent(tags.slice(0, 4).join(','));
  const seed = encodeURIComponent(tags.join('-'));
  const label = encodeURIComponent(tags[0]);

  candidates.push(`https://loremflickr.com/${size.width}/${size.height}/${tagSlug}`);
  candidates.push(`https://picsum.photos/seed/${seed}/${size.width}/${size.height}`);
  candidates.push(`https://placehold.co/${size.width}x${size.height}?text=${label}`);

  return candidates;
}
