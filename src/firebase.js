import React from "react";
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";

// Initialize Firebase

/*
-------------CREATE USER------------
firebase
  .auth()
  .createUserWithEmailAndPassword("juandak16@gmail.com", "pollitopio")
  .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

--------- CHANGE PASSWORD----------
  auth.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log(user);
    var user = await auth.auth().currentUser;
    user
      .updatePassword("532525")
      .then(function () {
        console.log("se cambio la clave");
      })
      .catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });
    console.log(user);
  } else {
    console.log(user);
  }
});
*/
export const Auth = React.createContext("");

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
