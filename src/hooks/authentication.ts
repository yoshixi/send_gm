import firebase from "firebase/app";
import {
  onAuthStateChanged,
  getRedirectResult,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { useRouter } from "next/router";

export const OAUTH_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  clientId: process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
};

export interface User {
  uid: string;
  providerId: string;
  displayName: string;
  photoURL: string;
}

export interface UserGoogleCred {
  token: string;
  secret: string;
}

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
  const [user, setUser] = useRecoilState(userState);
  const [userGoogleCred, setUserGoogleCred] =
    useRecoilState(userGoogleCredState);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
        });
        router.replace("/dashboard");
      } else {
        // User is signed out.
        setUser(null);
        router.replace("/");
      }
    });

    // TwitterのOAuthトークンを取得したい場合のみ（Twitter APIを使って追加情報を取得するなど）
    // SignInWithRedirect()で戻ってきたときにresultを取得する
    getRedirectResult(auth)
      .then((result) => {
        console.log("result: ", result);
        if (result) {
          /** @type {firebase.auth.OAuthCredential} */
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken || "";
          const secret = credential?.secret || "";
          setUserGoogleCred({ token, secret });

          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
        }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

    // コンポーネント削除時に購読をクリーンアップ
    return () => unsub();
  }, []); // useEffectを1回だけ呼ぶために第2引数に[]を渡す

  return { user, userGoogleCred };
}

export const Login = () => {
  console.log("Login..");
  const provider = new GoogleAuthProvider();
  OAUTH_CONFIG.scopes.forEach((scope) => {
    provider.addScope(scope);
  });
  signInWithRedirect(auth, provider)
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
