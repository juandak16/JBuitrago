import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_ALL_USERS } from "../../../constants/queries";
import ConfirmationModal from "../../ConfirmationModal";
import { Auth } from "../../../firebase";
import SelectSearch from "react-select-search";
export const INSERT_CLIENT = gql`
  mutation InsertClient(
    $address: String
    $city: String
    $name: String
    $phone: String
    $rif_number: numeric
    $rif_type: String
    $user_id: String
  ) {
    insert_client(
      objects: {
        address: $address
        city: $city
        name: $name
        phone: $phone
        rif_number: $rif_number
        rif_type: $rif_type
        user_id: $user_id
      }
    ) {
      returning {
        id
      }
    }
  }
`;
export const UPDATE_CLIENT = gql`
  mutation InsertClient(
    $address: String
    $city: String
    $name: String
    $phone: String
    $rif_number: numeric
    $rif_type: String
    $id: Int
    $user_id: String
  ) {
    update_client(
      where: { id: { _eq: $id } }
      _set: {
        address: $address
        city: $city
        name: $name
        phone: $phone
        rif_number: $rif_number
        rif_type: $rif_type
        id: $id
        user_id: $user_id
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const CrudClient = (props) => {
  const { isOpenModal, toggleModal, client, refetchClient } = props;
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS(gql));
  const [state, setState] = useState("initial");
  const [insertClient] = useMutation(INSERT_CLIENT);
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [userId, setUserId] = useState(client ? client.user_id : null);
  const nameRef = useRef(null);
  const rifTypeRef = useRef(null);
  const rifNumberRef = useRef(null);
  const cityRef = useRef(null);
  const addressRef = useRef(null);
  const phoneRef = useRef(null);
  const auth = useContext(Auth);
  const toggleConfirmationModal = () => {
    setIsConfirmation(!isConfirmation);
  };

  useEffect(() => {
    if (data) getUsers();
  }, [data]);

  const checkedClient = () => {
    if (
      nameRef.current.value &&
      rifTypeRef.current.value !== "0" &&
      rifNumberRef.current.value &&
      cityRef.current.value &&
      addressRef.current.value &&
      phoneRef.current.value
    ) {
      toggleConfirmationModal();
    } else {
      alert("Debe completar todos los campos");
    }
  };
  const getUsers = () => {
    console.log(user);
    //console.log(client);
    /*
      let obj = {
        id: 0,
        name: "",
      };
      client.unshift(obj);
    */
    user.map((item) => {
      item.value = item.id;
      return null;
    });
    setListUsers(user);
  };

  const crudClient = async () => {
    setState("loading");
    toggleConfirmationModal();
    if (client) {
      await updateClient({
        variables: {
          name: nameRef.current.value.toString(),
          rif_type: rifTypeRef.current.value.toString(),
          rif_number: rifNumberRef.current.value,
          city: cityRef.current.value.toString(),
          address: addressRef.current.value.toString(),
          phone: phoneRef.current.value.toString(),
          user_id: userId,
          id: client.id,
        },
      });
    } else {
      await insertClient({
        variables: {
          name: nameRef.current.value.toString(),
          rif_type: rifTypeRef.current.value.toString(),
          rif_number: rifNumberRef.current.value,
          city: cityRef.current.value.toString(),
          address: addressRef.current.value.toString(),
          phone: phoneRef.current.value.toString(),
          user_id: auth.sesion.role === "admin" ? userId : auth.sesion.uid,
        },
      });
    }

    await refetchClient();
    toggleModal();
    setState("initial");
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { user } = data;
  return (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-addItem"
    >
      <ModalHeader toggle={props.toggleModal}>
        <div>{client ? "Editar" : "Agregar"} Cliente</div>
      </ModalHeader>
      <ModalBody className="modal-body-crudItem">
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
              defaultValue={client ? client.name : null}
              ref={nameRef}
              //onChange={() => countChange(count)}
            />
          </div>
          {
            // ¿Esta seguro que desea {word} el {wordtwo}?
            isConfirmation ? (
              <ConfirmationModal
                isOpenModal={isConfirmation}
                toggleModal={toggleConfirmationModal}
                color={"primary"}
                word={client ? "editar" : "crear"}
                wordtwo={"cliente"}
                confirm={crudClient}
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
                style={{ width: 55 }}
                defaultValue={client ? client.rif_type : null}
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
                defaultValue={client ? client.rif_number : null}
                ref={rifNumberRef}
                //onChange={() => countChange(count)}
              />
            </div>
          </div>
        </div>
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Ciudad:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={client ? client.city : null}
              ref={cityRef}
              //onChange={() => countChange(count)}
            />
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
              defaultValue={client ? client.address : null}
              ref={addressRef}
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
              defaultValue={client ? client.phone : null}
              ref={phoneRef}
              //onChange={() => countChange(count)}
            />
          </div>
          {auth.sesion.role === "admin" ? (
            <div className="container-label-crudItem">
              <div className="label-crudItem">
                <p>Usuario:</p>
              </div>
              <SelectSearch
                onChange={(value) => setUserId(value)}
                value={client ? userId : auth.sesion.uid}
                placeholder="Selecciona el Usuario"
                options={listUsers}
                search
              />
            </div>
          ) : null}
        </div>
      </ModalBody>
      <ModalFooter className="footer-crudItem">
        <div />
        <div className="buttons-action-crudItem">
          <Button color="secondary" onClick={toggleModal}>
            Atrás
          </Button>

          {client ? (
            <Button
              color="warning"
              onClick={() => checkedClient()}
              disabled={state === "loading"}
            >
              Editar
            </Button>
          ) : (
            <Button
              color="success"
              onClick={() => checkedClient()}
              disabled={state === "loading"}
            >
              Agregar
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default CrudClient;
