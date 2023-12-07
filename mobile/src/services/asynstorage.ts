import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoreKeys = {
  id: '@id',
  token: '@token',
  username: '@username',
  avatar: '@avatar',
  notificationId: '@notificationId',
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

export const clearData = async () => {
  await AsyncStorage.clear();
};
