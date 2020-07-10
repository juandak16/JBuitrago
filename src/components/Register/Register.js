import React, { Component, useContext, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
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
import { gql } from "apollo-boost";
import * as firebase from "firebase/app";
var config = {
  apiKey: "AIzaSyBWJBoi_F8NJo_jnhz7xMBjZJuTFEcxlyY",
  authDomain: "jbuitrago-972b4.firebaseapp.com",
  databaseURL: "https://jbuitrago-972b4.firebaseio.com",
};
var secondaryApp = firebase.initializeApp(config, "Secondary");

export const POST_USER = gql`
  mutation PostUser(
    $name: String
    $rif_type: String
    $rif_number: numeric
    $address: String
    $id: String
  ) {
    insert_user(
      objects: {
        name: $name
        rif_type: $rif_type
        rif_number: $rif_number
        address: $address
        id: $id
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const Register = () => {
  const auth = useContext(Auth);
  const [authState, setAuthState] = useState({ status: "loading" });
  const [postUser] = useMutation(POST_USER);

  const createUser = async () => {
    secondaryApp.auth().languageCode = "es";
    //url after verify
    let actionCodeSettings = {
      url: "http://localhost:3000/#/login",
    };
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword("rafaelsalass20@gmail.com", "532525")
      .then(async (firebaseUser) => {
        let user = secondaryApp.auth().currentUser;
        await postUser({
          variables: {
            name: "rafael salas",
            rif_type: "v",
            rif_number: 123456,
            address: "tucape",
            id: user.uid,
          },
        }).then((response) => {
          console.log("se creo ", response, " en hasura");
        });
        console.log("User " + user.uid + " created successfully!");
        //Email Verify
        /*user
          .sendEmailVerification(actionCodeSettings)
          .then(function () {
            console.log("mensaje enviado");
          })
          .catch(function (error) {
            // An error happened.
          });*/
        secondaryApp.auth().signOut();
      });
  };

  return authState.status === "created" ? (
    <Redirect from="/" to="/login" />
  ) : (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Form>
                  <h1>Registro de Usuarios</h1>
                  <p className="text-muted">Ingresa los Datos</p>
                  <div className="rows between">
                    <InputGroup
                      className="mb-3"
                      style={{ width: "45%", minWidth: 150 }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          style={{
                            padding: 5,
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}
                        >
                          <i
                            className="icon-user"
                            style={{ margin: 0, fontSize: 15 }}
                          ></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Nombre" />
                    </InputGroup>
                    <InputGroup
                      className="mb-3"
                      style={{ width: "45%", minWidth: 150 }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          style={{
                            padding: 5,
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}
                        >
                          <i
                            className="icon-user"
                            style={{ margin: 0, fontSize: 15 }}
                          ></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Apellido" />
                    </InputGroup>
                  </div>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </InputGroup>
                  <Button color="success" onClick={createUser} block>
                    Create Account
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
