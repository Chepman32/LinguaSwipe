import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  async getBoolean(key: string): Promise<boolean> {
    const v = await AsyncStorage.getItem(key);
    return v === 'true';
  },
  async setBoolean(key: string, value: boolean): Promise<void> {
    await AsyncStorage.setItem(key, value ? 'true' : 'false');
  },
  async get<T = unknown>(key: string): Promise<T | undefined> {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : undefined;
  },
  async set<T = unknown>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
};

export default storage;
