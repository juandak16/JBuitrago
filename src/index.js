import "react-app-polyfill/ie9"; // For IE 9-11 support
import "react-app-polyfill/stable";
// import 'react-app-polyfill/ie11'; // For IE 11 support
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { firebaseInstance } from "./firebase";
import firebaseConfig from "./firebase";
var admin = require("firebase-admin");

firebaseInstance.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://jbuitrago-972b4.firebaseio.com",
});

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
