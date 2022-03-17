import {
  FirebaseOptions,
  getApps,
  getApp,
  initializeApp,
  FirebaseApp,
} from "firebase/app";

import {
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const getFirebaseApp = (): FirebaseApp => {
  if (typeof window !== "undefined") return initializeApp(firebaseConfig);
  if (!getApps().length) return initializeApp(firebaseConfig);

  return getApp();
}

const firebaseApp: FirebaseApp = getFirebaseApp()

export const auth = initializeAuth(firebaseApp, {
  persistence: typeof window === 'undefined' ? inMemoryPersistence : [
    indexedDBLocalPersistence,
    browserLocalPersistence,
  ], // ref: https://github.com/firebase/firebase-js-sdk/issues/5475#issuecomment-917616374
  popupRedirectResolver: browserPopupRedirectResolver,
});
export default firebaseApp;
