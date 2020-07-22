import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_ALL_USERS } from "../../../constants/queries";
import ConfirmationModal from "../../ConfirmationModal";
import { Auth } from "../../../firebase";
import SelectSearch from "react-select-search";

export const INSERT_PAY = gql`
  mutation InsertPay($name: String, $descount: numeric, $iva: numeric) {
    insert_type_pay(objects: { name: $name, descount: $descount, iva: $iva }) {
      returning {
        id
      }
    }
  }
`;
export const UPDATE_PAY = gql`
  mutation InsertPay(
    $name: String
    $descount: numeric
    $iva: numeric
    $id: Int
  ) {
    update_type_pay(
      where: { id: { _eq: $id } }
      _set: { name: $name, descount: $descount, iva: $iva }
    ) {
      returning {
        id
      }
    }
  }
`;

const CrudPay = (props) => {
  const { isOpenModal, toggleModal, item, refetchPay } = props;
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS(gql));
  const [state, setState] = useState("initial");
  const [insert_type_pay] = useMutation(INSERT_PAY);
  const [update_type_pay] = useMutation(UPDATE_PAY);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const nameRef = useRef(null);
  const descountRef = useRef(null);
  const ivaRef = useRef(null);
  const toggleConfirmationModal = () => {
    setIsConfirmation(!isConfirmation);
  };

  /*useEffect(() => {
    if (data) getUsers();
  }, [data]);*/

  const checkedItem = () => {
    if (
      nameRef.current.value &&
      descountRef.current.value &&
      ivaRef.current.value
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

  const crudItem = async () => {
    setState("loading");
    toggleConfirmationModal();
    if (item) {
      console.log("update");
      await update_type_pay({
        variables: {
          name: nameRef.current.value.toString(),
          descount: descountRef.current.value.toString(),
          iva: ivaRef.current.value.toString(),
          id: item.id,
        },
      });
    } else {
      console.log("insert");
      await insert_type_pay({
        variables: {
          name: nameRef.current.value.toString(),
          descount: descountRef.current.value.toString(),
          iva: ivaRef.current.value.toString(),
        },
      });
    }

    await refetchPay();
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
      className="modal-sm modal-addItem"
    >
      <ModalHeader toggle={props.toggleModal}>
        <div>{item ? "Editar" : "Agregar"} Tipo de Pago</div>
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
              defaultValue={item ? item.name : null}
              ref={nameRef}
              //onChange={() => countChange(count)}
            />
          </div>

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Descuento:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={item ? item.descount : null}
              ref={descountRef}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>IVA:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={item ? item.iva : null}
              ref={ivaRef}
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

          {item ? (
            <Button
              color="warning"
              onClick={() => checkedItem()}
              disabled={state === "loading"}
            >
              Editar
            </Button>
          ) : (
            <Button
              color="success"
              onClick={() => checkedItem()}
              disabled={state === "loading"}
            >
              Agregar
            </Button>
          )}
        </div>
      </ModalFooter>
      {
        // ¿Esta seguro que desea {word} el {wordtwo}?
        isConfirmation ? (
          <ConfirmationModal
            isOpenModal={isConfirmation}
            toggleModal={toggleConfirmationModal}
            color={"primary"}
            word={item ? "editar" : "crear"}
            wordtwo={"tipo de pago"}
            confirm={crudItem}
            state={state}
          />
        ) : null
      }
    </Modal>
  );
};

export default CrudPay;
