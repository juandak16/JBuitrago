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
const admin = require("firebase-admin");

const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const auth = useContext(Auth);

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

  return (
    <div className="app flex-row align-items-center">
      <img src={fondo} className="fondo" />
      <div className="overley" />
      {redirect ? <Redirect from="/" to="/notaentrega" /> : null}
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
                    placeholder="Email"
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
                    placeholder="Password"
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
                      Login
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
  );
};

export default Login;
