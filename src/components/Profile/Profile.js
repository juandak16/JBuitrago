import React, { useState, useRef, useContext } from "react";
import { Button } from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ConfirmationModal from "../ConfirmationModal";
import { GET_USER } from "../../constants/queries";
import { Auth } from "../../firebase";

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

const Profile = (props) => {
  const auth = useContext(Auth);
  const [updateUser] = useMutation(UPDATE_USER);
  const [state, setState] = useState("initial");
  const { loading, error, data, refetch } = useQuery(GET_USER(gql, props.id));
  const [isConfirmation, setIsConfirmation] = useState(false);
  const nameRef = useRef(null);
  const rifTypeRef = useRef(null);
  const rifNumberRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const addressRef = useRef(null);
  const phoneRef = useRef(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(auth.sesion.role);
  const { user } = data;

  const toggleConfirmationModal = () => {
    setIsConfirmation(!isConfirmation);
  };

  const checked = () => {
    if (
      emailRef.current.value &&
      nameRef.current.value &&
      rifTypeRef.current.value !== "0" &&
      rifNumberRef.current.value &&
      addressRef.current.value &&
      phoneRef.current.value
    ) {
      toggleConfirmationModal();
    } else {
      alert("Debe completar todos los campos");
    }
  };

  const editClient = async () => {
    setState("loading");
    console.log("edito");
    console.log(user);
    //case update email or name
    if (
      user[0].name !== nameRef.current.value ||
      user[0].email !== emailRef.current.value
    ) {
      let updateProfile = auth.functions().httpsCallable("updateProfile");
      console.log("edit profile");
      await updateProfile({
        email: emailRef.current.value,
        name: nameRef.current.value,
        uid: user[0].id,
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
        uid: user[0].id,
      })
        .then(async (result) => {
          // Read result of the Cloud Function.
          console.log("se actualizo el clave");
          passwordRef.current.value = "";
          // ...
        })
        .catch((error) => {
          console.log("no password");
          console.log(error);
        });
    }

    await updateUser({
      variables: {
        email: emailRef.current.value,
        name: nameRef.current.value,
        rif_type: rifTypeRef.current.value,
        rif_number: rifNumberRef.current.value,
        address: addressRef.current.value,
        id: user[0].id,
        role: auth.sesion.role,
        phone: phoneRef.current.value,
      },
    })
      .then((response) => {
        console.log("se actualizo ", response, " en hasura");
      })
      .catch(function (error) {
        console.log(error);
      });
    await refetch();
    toggleConfirmationModal();
    setState("initial");
  };

  return (
    <div className="content-profile">
      <div toggle={props.toggleModal} className="content-title">
        <div className="title">Datos de Usuario</div>
      </div>
      <div className="content-body">
        <div className="content-row">
          <div className="container-label-profile">
            <div className="label-profile">
              <p>Correo:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-profile"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user[0].email}
              ref={emailRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>

          <div className="container-label-profile">
            <div className="label-profile">
              <p>Nueva Contraseña:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-profile"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              ref={passwordRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>

        <div className="content-row">
          <div className="container-label-profile">
            <div className="label-profile">
              <p>Nombre:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-profile"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user[0].name}
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
                color="warning"
                word="editar"
                wordtwo="usuario"
                confirm={editClient}
                state={state}
              />
            ) : null
          }

          <div className="container-label-profile">
            <div className="label-profile">
              <p>Rif:</p>
            </div>
            <div className="select-rif-group">
              <select
                className="custom-select select-rif"
                style={{ width: 55, color: "#5c6873" }}
                defaultValue={user[0].rif_type}
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
                defaultValue={user[0].rif_number}
                ref={rifNumberRef}
                style={{ color: "#5c6873" }}
                //onChange={() => countChange(count)}
              />
            </div>
          </div>
        </div>
        <div className="content-row">
          <div className="container-label-profile">
            <div className="label-profile">
              <p>Teléfono:</p>
            </div>
            <input
              //accessKey={index}
              type="number"
              className="input-profile"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user[0].phone}
              ref={phoneRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>

          <div className="container-label-profile">
            <div className="label-profile">
              <p>Dirección:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-profile"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={user[0].address}
              ref={addressRef}
              style={{ color: "#5c6873" }}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>
      </div>
      <div className="content-footer">
        <div />
        <div className="buttons-action-profile">
          <Button color="warning" onClick={() => checked()}>
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
