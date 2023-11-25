export const ENVIRONMENTAL_VARIABLES = {
  DATABASE_URL: 'DATABASE_URL',
  AT_SECRET: 'AT_SECRET',
  RT_SECRET: 'RT_SECRET',
  GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
  GOOGLE_SECRET: 'GOOGLE_SECRET',
  APPLE_NONCE: 'APPLE_NONCE',
  APPLE_AUDIENCE_IDS: 'APPLE_AUDIENCE_IDS',
  GOOGLE_AUDIENCE_ID: 'GOOGLE_AUDIENCE_ID',
  GOOGLE_WEB_AUDIENCE_ID: 'GOOGLE_WEB_AUDIENCE_ID',
  GOOGLE_IOS_AUDIENCE_ID: 'GOOGLE_IOS_AUDIENCE_ID',
  GOOGLE_ANDROID_AUDIENCE_ID: 'GOOGLE_ANDROID_AUDIENCE_ID',
  ENCRYPTION_KEY: 'ENCRYPTION_KEY',
  ENCRYPTION_ALGORITHM: 'ENCRYPTION_ALGORITHM',
  FIREBASE_TYPE: 'FIREBASE_TYPE',
  FIREBASE_PROJECT_ID: 'FIREBASE_PROJECT_ID',
  FIREBASE_PRIVATE_KEY_ID: 'FIREBASE_PRIVATE_KEY_ID',
  FIREBASE_PRIVATE_KEY: 'FIREBASE_PRIVATE_KEY',
  FIREBASE_CLIENT_EMAIL: 'FIREBASE_CLIENT_EMAIL',
  FIREBASE_CLIENT_ID: 'FIREBASE_CLIENT_ID',
  FIREBASE_AUTH_URI: 'FIREBASE_AUTH_URI',
  FIREBASE_TOKEN_URI: 'FIREBASE_TOKEN_URI',
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: 'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
  FIREBASE_CLIENT_X509_CERT_URL: 'FIREBASE_CLIENT_X509_CERT_URL',
} as const;

export const AUTH_PROVIDERS = {
  APPLE: 'apple',
  GOOGLE: 'google',
} as const;

export const cacheKeys = {
  REFRESH_TOKEN: 'REFRESH_TOKEN',
} as const;

export const AVATARS = {
  TU9OS0VZX09ORQ: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305667/anonn-avatars/01.png',
  TU9OS0VZX1RXTw: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305666/anonn-avatars/02.png',
  TU9OS0VZX1RIUkVF: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305666/anonn-avatars/03.png',
  TU9OS0VZX0ZPVVI: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305666/anonn-avatars/04.png',
  TU9OS0VZX0ZJVkU: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305667/anonn-avatars/05.png',
  TU9OS0VZX1NJWA: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305666/anonn-avatars/06.png',
  TU9OS0VZX1NFVkVO: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305668/anonn-avatars/07.png',
  TU9OS0VZX0VJR0hU: 'https://res.cloudinary.com/dd1kbfk70/image/upload/v1671305670/anonn-avatars/08.png',
} as const;
