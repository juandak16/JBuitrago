import React, { Component, useContext, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import { Auth } from "../../firebase";

const Login2 = () => {
  const [redirect, setRedirect] = useState(false);
  const [authState, setAuthState] = useState({ status: "loading" });
  const auth = useContext(Auth);
  const provider = new auth.auth.GoogleAuthProvider();

  useEffect(() => {
    return auth.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim = await idTokenResult.claims[
          "https://hasura.io/jwt/claims"
        ];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = auth
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");
          console.log(metadataRef);
          metadataRef.on("value", async (data) => {
            if (!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
          console.log(metadataRef);
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const login = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    auth
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("david inicio sesion");

        setRedirect(true);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Email y/o Contraseña incorrecta");
        // ...
      });
  };

  const signOut = async () => {
    console.log(authState);
    try {
      setAuthState({ status: "loading" });
      await auth.auth().signOut();
      setAuthState({ status: "out" });
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await auth.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  let content;
  if (authState.status === "loading") {
    content = <button onClick={signInWithGoogle}>Sign in with Google</button>;
  } else {
    content = (
      <>
        <div>
          {authState.status === "in" ? (
            <div>
              <h2>Welcome, {authState.user.displayName}</h2>
              <button onClick={signOut}>Sign out</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
        </div>
      </>
    );
  }

  return <div className="auth">{content}</div>;
};

export default Login2;
