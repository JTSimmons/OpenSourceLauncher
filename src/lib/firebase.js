import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  browserPopupRedirectResolver,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const config = {
  apiKey:  "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(config);

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});

export { app, auth };
