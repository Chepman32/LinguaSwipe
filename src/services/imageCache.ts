import storage from './storage';

const KEY = 'image_cache_v1';

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
