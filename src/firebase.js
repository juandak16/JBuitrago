import React from "react";
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

export const Auth = React.createContext("");
export const Auth2 = React.createContext("");

const firebaseConfig = {
  apiKey: "AIzaSyBWJBoi_F8NJo_jnhz7xMBjZJuTFEcxlyY",
  authDomain: "jbuitrago-972b4.firebaseapp.com",
  databaseURL: "https://jbuitrago-972b4.firebaseio.com",
  projectId: "jbuitrago-972b4",
  storageBucket: "jbuitrago-972b4.appspot.com",
  messagingSenderId: "12459843976",
  appId: "1:12459843976:web:c4007d32764c31bbd49a3d",
};

export const firebaseInstance = firebase;
export default firebaseConfig;
