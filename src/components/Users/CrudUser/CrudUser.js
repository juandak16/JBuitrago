import React, { useState, useRef, useContext } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import ConfirmationModal from "../../ConfirmationModal";
import { Auth } from "../../../firebase";
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
    $phone: numeric
    $email: String
    $role: String
  ) {
    insert_user(
      objects: {
        name: $name
        rif_type: $rif_type
        rif_number: $rif_number
        address: $address
        id: $id
        phone: $phone
        email: $email
        role: $role
      }
    ) {
      returning {
        id
      }
    }
  }
`;
export const UPDATE_USER = gql`
  mutation InsertUser(
    $name: String
    $rif_type: String
    $rif_number: numeric
    $address: String
    $id: String
    $phone: numeric
    $email: String
    $role: String
  ) {
    update_user(
      where: { id: { _eq: $id } }
      _set: {
        name: $name
        rif_type: $rif_type
        rif_number: $rif_number
        address: $address
        id: $id
        phone: $phone
        email: $email
        role: $role
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const CrudUser = (props) => {
  const { isOpenModal, toggleModal, user, refetchUser } = props;
  const [state, setState] = useState("initial");
  const [postUser] = useMutation(POST_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const nameRef = useRef(null);
  const rifTypeRef = useRef(null);
  const rifNumberRef = useRef(null);
  const roleRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const addressRef = useRef(null);
  const phoneRef = useRef(null);
  const auth = useContext(Auth);

  const toggleConfirmationModal = () => {
    setIsConfirmation(!isConfirmation);
  };

  const checked = () => {
    if (
      emailRef.current.value &&
      nameRef.current.value &&
      rifTypeRef.current.value !== "0" &&
      rifNumberRef.current.value &&
      roleRef.current.value !== "" &&
      addressRef.current.value &&
      phoneRef.current.value &&
      (!user ? passwordRef.current.value : true)
    ) {
      toggleConfirmationModal();
    } else {
      alert("Debe completar todos los campos");
    }
  };

  const editClient = async () => {
    setState("loading");
    console.log("edito");

    //case update role
    if (user.role !== roleRef.current.value) {
      let updateRole = auth.functions().httpsCallable("updateRole");
      await updateRole({ role: roleRef.current.value, uid: user.id })
        .then(async (result) => {
          // Read result of the Cloud Function.
          console.log("se actualizo el role");
          // ...
        })
        .catch((error) => {
          console.log("no role");
          console.log(error);
        });
    }

    //case update email or name
    if (
      user.name !== nameRef.current.value ||
      user.email !== emailRef.current.value
    ) {
      let updateProfile = auth.functions().httpsCallable("updateProfile");
      console.log("edit profile");
      await updateProfile({
        email: emailRef.current.value,
        name: nameRef.current.value,
        uid: user.id,
      })
        .then(async (result) => {
          // Read result of the Cloud Function.
          console.log("se actualizo el perfil");
          // ...
        })
        .catch((error) => {
          console.log("no profile");
          console.log(error);
        });
    }

    //case update password
    if (passwordRef.current.value) {
      let updatePassword = auth.functions().httpsCallable("updatePassword");
      console.log("edit password");
      await updatePassword({
        password: passwordRef.current.value,
        uid: user.id,
      })
        .then(async (result) => {
          // Read result of the Cloud Function.
          console.log("se actualizo el clave");
          // ...
        })
        .catch((error) => {
          console.log("no profile");
          console.log(error);
        });
    }

    await updateUser({
      variables: {
        email: emailRef.current.value,
        name: nameRef.current.value, //input name
        rif_type: rifTypeRef.current.value, //inpur rif type
        rif_number: rifNumberRef.current.value, //input rif number
        address: addressRef.current.value, //input address
        id: user.id,
        phone: phoneRef.current.value,
        role: roleRef.current.value,
      },
    })
      .then((response) => {
        console.log("se actualizo ", response, " en hasura");
      })
      .catch(function (error) {
        console.log(error);
      });
    await refetchUser();
    toggleConfirmationModal();
    toggleModal();
    setState("initial");
  };

  const createUser = async () => {
    setState("loading");
    secondaryApp.auth().languageCode = "es";
    //url after verify
    /*let actionCodeSettings = {
      url: "http://localhost:3000/#/login",
    };*/

    await secondaryApp
      .auth()
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      ) //input email and password
      .then(async (firebaseUser) => {
        console.log(firebaseUser);
        let user = secondaryApp.auth().currentUser;
        console.log(user);

        await user
          .updateProfile({
            displayName: nameRef.current.value, //input name
          })
          .then(async () => {
            console.log("se actualizo displayName");

            let updateRole = await auth.functions().httpsCallable("updateRole");
            console.log(roleRef.current.value, "-", user.uid);
            await updateRole({ role: roleRef.current.value, uid: user.uid })
              .then(async (result) => {
                // Read result of the Cloud Function.
                console.log("se actualizo role");
                await postUser({
                  variables: {
                    email: user.email,
                    name: user.displayName, //input name
                    rif_type: rifTypeRef.current.value, //inpur rif type
                    rif_number: rifNumberRef.current.value, //input rif number
                    address: addressRef.current.value, //input address
                    id: user.uid,
                    phone: phoneRef.current.value,
                    role: roleRef.current.value,
                  },
                })
                  .then((response) => {
                    console.log("se creo ", response, " en hasura");
                    //Email Verify
                    /*user
                .sendEmailVerification(actionCodeSettings)
                .then(function () {
                  console.log("mensaje enviado");
                })
                .catch(function (error) {
                  // An error happened.
                });*/
                  })
                  .catch(function (error) {
                    console.log(error);
                  });

                // ...
              })
              .catch((error) => {
                console.log("no");
                console.log(error);
              });
          })
          .catch(function (error) {
            // An error happened.
          });

        console.log("User " + user.uid + " created successfully!");

        secondaryApp.auth().signOut();
      });
    await refetchUser();
    toggleConfirmationModal();
    toggleModal();
    setState("initial");
  };
  return (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-addItem"
    >
      <ModalHeader toggle={props.toggleModal}>
        <div>{user ? "Editar" : "Agregar"} Usuario</div>
      </ModalHeader>
      <ModalBody className="modal-body-crudItem">
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Correo:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user ? user.email : null}
              ref={emailRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              {user ? <p>Nueva Contraseña:</p> : <p>Contraseña:</p>}
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user ? null : null}
              ref={passwordRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>

        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Nombre:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user ? user.name : null}
              ref={nameRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>
          {
            //message: ¿Esta seguro que desea {word} el {wordtwo}?
            isConfirmation ? (
              <ConfirmationModal
                isOpenModal={isConfirmation}
                toggleModal={toggleConfirmationModal}
                color={"primary"}
                word={user ? "editar" : "crear"}
                wordtwo={"usuario"}
                confirm={user ? editClient : createUser}
                state={state}
              />
            ) : null
          }

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Rif:</p>
            </div>
            <div className="select-rif-group">
              <select
                className="custom-select select-rif"
                style={{ width: 55, color: "#5c6873" }}
                defaultValue={user ? user.rif_type : null}
                //id="typePay"
                ref={rifTypeRef}
              >
                <option value="0"></option>
                <option value="v">V</option>
                <option value="j">J</option>
                <option value="e">E</option>
              </select>
              <input
                //accessKey={index}
                type="text"
                className="input-rif"
                aria-label="cantidad"
                aria-describedby="basic-addon1"
                defaultValue={user ? user.rif_number : null}
                ref={rifNumberRef}
                style={{ color: "#5c6873" }}
                //onChange={() => countChange(count)}
              />
            </div>
          </div>
        </div>
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Rol:</p>
            </div>
            <div className="select-rif-group">
              <select
                className="custom-select "
                style={{ width: "100%", color: "#5c6873" }}
                defaultValue={user ? user.role : "seller"}
                //id="typePay"
                ref={roleRef}
              >
                <option value="seller">Vendedor</option>
                <option value="admin">Admin</option>
                <option value="jbuitrago">Jbuitrago</option>
                <option value="client">Cliente</option>
              </select>
            </div>
          </div>

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Dirección:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user ? user.address : null}
              ref={addressRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Teléfono:</p>
            </div>
            <input
              //accessKey={index}
              type="number"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user ? user.phone : null}
              ref={phoneRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="footer-crudItem">
        <div />
        <div className="buttons-action-crudItem">
          <Button color="secondary" onClick={toggleModal}>
            Atrás
          </Button>

          {user ? (
            <Button color="warning" onClick={() => checked()}>
              Editar
            </Button>
          ) : (
            <Button color="success" onClick={() => checked()}>
              Agregar
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CrudUser;
