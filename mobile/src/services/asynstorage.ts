import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoreKeys = {
  token: '@token',
  username: '@username',
  avatar: '@avatar',
} as const;

type StoreKeysType = typeof StoreKeys;
type StoreKey = StoreKeysType[keyof StoreKeysType];

export const storeData = async (key: StoreKey, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const retrieveData = async (key: StoreKey) => {
  const value = await AsyncStorage.getItem(key);
  return value;
};
