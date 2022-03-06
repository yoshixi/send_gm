import {
  onAuthStateChanged,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { User, UserGoogleCred } from "@/models/user";

export const OAUTH_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  clientId: process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
};

const userState = atom<User | null>({
  key: "user",
  default: null,
});

const userGoogleCredState = atom<UserGoogleCred | null>({
  key: "userGoogleCred",
  default: null,
});

// 最新のfirebaseUserをステートとして返す関数
export function useAuthentication() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [userGoogleCred, setUserGoogleCred] =
    useRecoilState(userGoogleCredState);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser && auth.currentUser) {
      setCurrentUser({
        uid: auth.currentUser.uid,
        providerId: auth.currentUser.providerId,
        displayName: auth.currentUser.displayName || "",
        photoURL: auth.currentUser.photoURL || "",
        email: auth.currentUser.email || "",
      });
    }
    const unsub = onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          email: firebaseUser.email || "",
        });
      } else {
        // User is signed out.
        setCurrentUser(null);
        router.replace("/");
      }
    });

    // コンポーネント削除時に購読をクリーンアップ
    return () => unsub();
  }, []);

  return { currentUser, userGoogleCred };
}

// make component like LoginButton to use hooks function
export const Login = () => {
  console.log("Login..");
  const provider = new GoogleAuthProvider();
  OAUTH_CONFIG.scopes.forEach((scope) => {
    provider.addScope(scope);
  });
  return signInWithRedirect(auth, provider)
    .then(function (result: any) {
      console.log("Logged in successfully");
      console.log("result: ", result);
      return result;
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const Logout = () => {
  auth.signOut().then(() => {
    window.location.reload();
  });
};
