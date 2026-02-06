import storage from './storage';
import FastImage from 'react-native-fast-image';

// Bump when image URL/resolution logic changes so existing installs re-download the new assets.
const KEY = 'image_cache_v3';

type ImageCacheState = {
  cachedByLanguage: Record<string, boolean>;
  updatedAt: number;
};

export async function areLanguageImagesCached(languageId: string) {
  const state = await storage.get<ImageCacheState>(KEY);
  return Boolean(state?.cachedByLanguage?.[languageId]);
}

export async function setLanguageImagesCached(languageId: string, cached: boolean) {
  const prev = (await storage.get<ImageCacheState>(KEY)) ?? { cachedByLanguage: {}, updatedAt: Date.now() };
  prev.cachedByLanguage[languageId] = cached;
  prev.updatedAt = Date.now();
  await storage.set(KEY, prev);
}

export async function clearImageCache() {
  try {
    FastImage.clearMemoryCache();
  } catch {
    // ignore
  }

  try {
    await FastImage.clearDiskCache();
  } catch {
    // ignore
  }

  await storage.remove(KEY);
}
