import { useEffect, useState, Dispatch } from "react";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { OAUTH_CONFIG, Login } from "./authentication";

export const EMAIL_REGEX =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

export type SendMailParams = {
  to: string;
  from: string;
  toName?: string;
  bcc?: string;
  subject: string;
  message: string;
};

export const initializeGapi = () => {
  //loads the Google JavaScript Library
  const id = "google-js-api";
  const src = "https://apis.google.com/js/api.js";

  //we have at least one script (React)
  const firstJs = document.getElementsByTagName("script")[0];

  //prevent script from loading twice
  if (document.getElementById(id)) {
    return;
  }
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.onload = function (e) {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: OAUTH_CONFIG.apiKey,
          clientId: OAUTH_CONFIG.clientId,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: OAUTH_CONFIG.scopes.join(" "),
        })
        .then(() => {
          // Make sure the Google API Client is properly signed in
          if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            Login();
            return;
          }
        });
    });
  };

  document.getElementsByTagName("head")[0].appendChild(script);
};

const makeBody = (params: SendMailParams) => {
  params.subject = Buffer.from(params.subject).toString("base64");
  const headers = [
    `Content-Type: text/plain; charset=\"UTF-8\"\n`,
    `MIME-Version: 1.0\n`,
    `Content-Transfer-Encoding: 7bit\n`,
    `to: ${params.to} \n`,
    `from: ${params.from} \n`,
    `subject: =?UTF-8?B?${params.subject}?= \n\n`,
  ];
  if (params.bcc) {
    headers.push(`bcc: ${params.bcc} \n`);
  }

  const str = [...headers, params.message].join("");
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const useGmail = () => {
  useEffect(() => {
    initializeGapi();
  }, []);

  return { sendGmail };
};

export const sendGmail = (params: SendMailParams) => {
  if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    Login();
    return;
  }

  const raw = makeBody({
    to: params.to,
    from: params.from,
    subject: params.subject,
    message: params.message,
  });

  return gapi.client.gmail.users.messages
    .send({ resource: { raw }, userId: "me" })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.log(e);
    });
};
