import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import ProductRowInfo from "../ProductRowInfo/ProductRowInfo";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_INFO_PEDIDO } from "../../../constants/queries";
import ResumenPedido from "../ResumenPedido/ResumenPedido";
import CrudClient from "../../Clients/CrudClient/CrudClient";
import SelectSearch from "react-select-search";

const InfoPedido = (props) => {
  const { loading, error, data, refetch } = useQuery(GET_INFO_PEDIDO(gql));
  const { isOpenModal, toggleModal, list } = props;
  const selectTypePay = useRef(null);
  const [createClient, setCreateClient] = useState(false);
  const [isOpenResumenPedido, setIsOpenResumenPedido] = useState(false);
  const [newList, setNewList] = useState([]);
  const [clientId, setClientId] = useState("0");
  const [typePayId, setTypePayId] = useState("0");
  const [listClient, setListClients] = useState([]);

  useEffect(() => {
    setNewList(list.map(JSON.parse));
  }, []);

  useEffect(() => {
    if (data) getClients();
  }, [data]);

  const getClients = () => {
    let obj = {
      id: 0,
      name: "",
    };
    client.unshift(obj);
    client.map((item) => {
      item.value = item.id.toString();
    });
    setListClients(client);
  };

  let pedidoObject = {};

  const toggleResumenPedido = async () => {
    setIsOpenResumenPedido(!isOpenResumenPedido);
  };

  const toggleCreateClient = () => {
    setCreateClient(!createClient);
  };
  const generarResumen = () => {
    pedidoObject.client_id = clientId;
    pedidoObject.typePay_id = typePayId;
    pedidoObject.list = newList;
    return pedidoObject;
  };

  const deleteItem = (index) => {
    newList.splice(index, 1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { client, type_pay } = data;
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
            {createClient ? (
              <CrudClient
                isOpenModal={createClient}
                toggleModal={toggleCreateClient}
                refetchClient={refetch}
              />
            ) : null}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter className="footer-infopedido">
        <div className="detail-pedido">
          <div className="detail" style={{ width: 375 }}>
            <div className="input-group mb-3 dropdown-infopedido">
              <div className="input-group-prepend">
                <label className="input-group-text">Cliente</label>
              </div>
              <SelectSearch
                onChange={(value) => setClientId(value)}
                value={clientId}
                placeholder="Selecciona el Cliente"
                options={listClient}
                search
              />
            </div>
            <Button
              className="btn btn-success btn-square btn-add-infopedido"
              onClick={toggleCreateClient}
            >
              Agregar
            </Button>
          </div>
          <div className="detail" style={{ width: 340 }}>
            <div className="input-group mb-3 dropdown-infopedido">
              <div className="input-group-prepend">
                <label className="input-group-text">Tipo de Pago</label>
              </div>
              <select
                className="custom-select capitalize"
                id="typePay"
                ref={selectTypePay}
                value={typePayId}
                onChange={() => setTypePayId(selectTypePay.current.value)}
              >
                <option value="0">Selecciona el tipo de pago</option>
                {type_pay.map((type_pay, index) => (
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
            onClick={() => toggleResumenPedido()}
          >
            Generar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  ) : clientId > 0 && typePayId > 0 && newList[0] ? (
    <ResumenPedido
      isOpenModal={isOpenResumenPedido}
      toggleModal={toggleResumenPedido}
      toggleModalInfo={toggleModal}
      getObject={generarResumen}
    />
  ) : (
    (setIsOpenResumenPedido(!isOpenResumenPedido),
    alert("debe completar todos los campos"))
  );
};

export default InfoPedido;
