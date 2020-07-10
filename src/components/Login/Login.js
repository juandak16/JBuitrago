import React, { Component, useContext, useState } from "react";
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
import logo from "../../assets/img/brand/logo.png";
import fondo from "../../assets/img/brand/fondo-login.jpg";
//const functions = require("firebase-functions");

const Login = (props) => {
  const auth = useContext(Auth);

  const login = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    auth
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        //set user data in auth.sesion
        auth
          .auth()
          .currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            let user = auth.auth().currentUser;
            if (user != null) {
              auth.sesion = {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                role:
                  idTokenResult.claims["https://hasura.io/jwt/claims"][
                    "x-hasura-default-role"
                  ],
              };
              props.history.push("/notaentrega");
              console.log(`${auth.sesion.name} inicio sesion`);
            } else {
              auth.sesion = null;
              console.log(`${auth.sesion.name} se cargo`);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        // ...
      });
  };

  return !auth.sesion ? (
    <div className="app flex-row align-items-center">
      <img src={fondo} className="fondo" />
      <div className="overley" />
      <Container>
        <Row className="justify-content-center">
          <Card style={{ width: 340, backgroundColor: "#fffffff0" }}>
            <CardBody style={{ paddingTop: 0 }}>
              <form onSubmit={login}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={logo} style={{ width: 180 }} />
                </div>
                <p className="text-muted">Inicie sesión con su cuenta</p>
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-user"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    name="email"
                    className="form-control"
                    type="text"
                    placeholder="Correo"
                    autoComplete="Email"
                  />
                </InputGroup>
                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <input
                    name="password"
                    className="form-control"
                    type="password"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                  />
                </InputGroup>
                <Row>
                  <Col xs="6">
                    <button
                      color="primary"
                      className="px-4 btn btn-success "
                      type="submit"
                    >
                      Iniciar sesión
                    </button>
                  </Col>
                  <Col xs="6" className="text-right">
                    <Button color="link" className="px-0">
                      ¿Olvido su contraseña?
                    </Button>
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Row>
      </Container>
    </div>
  ) : (
    <Redirect from="/" to="/notaentrega" />
  );
};

export default Login;
