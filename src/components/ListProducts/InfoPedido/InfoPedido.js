import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Badge,
  Table,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import ProductRowInfo from "../ProductRowInfo/ProductRowInfo";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_INFO_PEDIDO } from "../../../constants/queries";
import ResumenPedido from "../ResumenPedido/ResumenPedido";

const InfoPedido = (props) => {
  const { loading, error, data } = useQuery(GET_INFO_PEDIDO(gql));
  const { isOpenModal, toggleModal, list } = props;
  //const { pedidoObject, setPedidoObject } = useState(null);
  const selectClient = useRef(null);
  const selectTypePay = useRef(null);
  const [isOpenResumenPedido, setIsOpenResumenPedido] = useState(false);
  const [newList, setNewList] = useState([]);

  useEffect(() => {
    setNewList(list.map(JSON.parse));
  }, []);

  let pedidoObject = new Object();

  const toggleResumenPedido = () => {
    setIsOpenResumenPedido(!isOpenResumenPedido);
  };

  const generarResumen = () => {
    if (selectClient.current.value != 0 && selectTypePay.current.value != 0) {
      pedidoObject.client_id = selectClient.current.value;
      pedidoObject.typePay_id = selectTypePay.current.value;
      pedidoObject.list = newList;

      return pedidoObject;
    } else {
    }
  };

  const deleteItem = (item) => {
    list.splice(list.indexOf(item), 1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return !isOpenResumenPedido ? (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-infopedido"
    >
      <ModalHeader toggle={props.toggleModal}>
        Información del Pedido
      </ModalHeader>
      <ModalBody className="modal-body-info">
        <Table responsive size="sm" striped>
          <thead>
            <tr>
              <th scope="col" className="center-tab">
                Código
              </th>
              <th scope="col" className="center-tab">
                Descripción
              </th>
              <th scope="col" className="center-tab">
                Marca
              </th>
              <th scope="col" className="center-tab">
                Precio (USD)
              </th>
              <th scope="col" className="center-tab">
                Cantidad
              </th>
              <th scope="col" className="center-tab">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {newList.map((item, index) => (
              <ProductRowInfo
                key={index}
                item={item}
                deleteItem={deleteItem}
                index={index}
                list={newList}
              />
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter className="footer-infopedido">
        <div className="detail-pedido">
          <div className="detail">
            <div className="input-group mb-3 dropdown-infopedido">
              <div className="input-group-prepend">
                <label className="input-group-text">Cliente</label>
              </div>
              <select
                className="custom-select capitalize"
                id="client"
                ref={selectClient}
              >
                <option value="0">Choose...</option>
                {data.client.map((client, index) => (
                  <option
                    key={index}
                    value={client.id}
                    className="option-infopedido"
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <Button className="btn btn-success btn-square btn-add-infopedido">
              Agregar
            </Button>
          </div>
          <div className="detail">
            <div className="input-group mb-3 dropdown-infopedido">
              <div className="input-group-prepend">
                <label className="input-group-text">Tipo de Pago</label>
              </div>
              <select
                className="custom-select capitalize"
                id="typePay"
                ref={selectTypePay}
              >
                <option value="0">Choose...</option>
                {data.type_pay.map((type_pay, index) => (
                  <option
                    key={index}
                    value={type_pay.id}
                    className="capitalize"
                  >
                    {type_pay.name}
                  </option>
                ))}
              </select>
            </div>
            <Button className="btn btn-success btn-square btn-add-infopedido">
              Agregar
            </Button>
          </div>
        </div>
        <div className="buttons-infopedido">
          <Button
            className="btn btn-danger"
            color="secondary"
            onClick={props.toggleModal}
          >
            Cancelar
          </Button>
          <Button
            className="btn btn-success"
            color="primary"
            onClick={() => (pedidoObject = toggleResumenPedido())}
          >
            Generar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  ) : selectClient.current.value != 0 && selectTypePay.current.value != 0 ? (
    <ResumenPedido
      isOpenModal={isOpenModal}
      toggleModal={toggleResumenPedido}
      pedidoObject={generarResumen()}
    />
  ) : (
    (setIsOpenResumenPedido(!isOpenResumenPedido),
    alert("debe completar todos los campos"))
  );
};

export default InfoPedido;
