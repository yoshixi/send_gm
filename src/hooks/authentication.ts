import firebase from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  getRedirectResult,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
export interface User {
  uid: string;
  providerId: string;
  displayName: string;
  photoURL: string;
}

const userState = atom<User>({
  key: "user",
  default: null,
});

// 最新のfirebaseUserをステートとして返す関数
export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState);

  console.log("Start useEffect");

  useEffect(() => {
    // firebase auth state の購読
    // () => Login() でTwitterログインしたらRecoilStateをsetするための処理
    const unsub = onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        console.log("Set user");
        setUser({
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
        });
      } else {
        // User is signed out.
        setUser(null);
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
          const token = credential?.accessToken;
          const secret = credential?.secret;

          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
        }

        // The signed-in user info.
        user = result.user;
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

  return { user };
}

// ここでTwitterログイン
export const Login = () => {
  console.log("Login..");
  const provider = new GoogleAuthProvider();
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
