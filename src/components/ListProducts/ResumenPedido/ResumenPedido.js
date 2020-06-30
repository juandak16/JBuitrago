import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import ProductRowResumen from "../ProductRowResumen/ProductRowResumen";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_RESUMEN_PEDIDO } from "../../../constants/queries";

export const POST_ORDER = gql`
  mutation PostOrder($object: [order_insert_input!]!) {
    insert_order(objects: $object) {
      returning {
        id
      }
    }
  }
`;

export const POST_DETAIL_ORDER = gql`
  mutation PostDetailOrder($object: [detail_order_insert_input!]!) {
    insert_detail_order(objects: $object) {
      returning {
        id
      }
    }
  }
`;

const ResumenPedido = (props) => {
  const { isOpenModal, toggleModal, toggleModalInfo, pedidoObject } = props;
  const [postOrder] = useMutation(POST_ORDER);
  const [postDetailOrder] = useMutation(POST_DETAIL_ORDER);
  const client_id = pedidoObject.client_id;
  const typePay_id = pedidoObject.typePay_id;
  const list = pedidoObject.list;
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [iva, setIva] = useState(0);

  useEffect(() => {
    sumTotal();
  }, []);

  const confirmarPedido = async () => {
    let object = {};
    object.type_list_id = list[0].type_list_id;
    object.client_id = client_id;
    object.user_id = "4"; //USER
    object.status_order_id = 1;
    object.type_pay_id = typePay_id;
    object.total_order = total.toString();
    object.subtotal_order = subTotal.toString();
    if (list[0].type_list_id === 2) {
      object.iva_order = iva.toString();
    }
    await postOrder({ variables: { object } }).then((response) => {
      object = {};
      list.map(async (detail, index) => {
        object.product_id = detail.id;
        object.order_id = response.data.insert_order.returning[0].id;
        object.count = detail.count;
        object.total = detail.total;
        await postDetailOrder({ variables: { object } });
        object = {};
      });
    });
    toggleModal();
    toggleModalInfo();
  };

  const sumTotal = () => {
    let newSubTotal = 0;
    let newTotal = 0;
    list.map((item) => {
      newSubTotal += item.price * item.count;
    });
    setSubTotal(newSubTotal);
    setIva(newSubTotal * 0.16);
    if (list[0].type_list_id === 1) {
      newTotal = newSubTotal;
      setTotal(newTotal);
    }
    if (list[0].type_list_id === 2) {
      newTotal = newSubTotal * 1.16;
      setTotal(newTotal);
    }
  };

  const { loading, error, data } = useQuery(
    GET_RESUMEN_PEDIDO(gql, client_id, typePay_id)
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-infopedido"
    >
      <ModalHeader toggle={props.toggleModal}>Resumen del Pedido</ModalHeader>
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
                SubTotal
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <ProductRowResumen key={index} item={item} list={list} />
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter className="footer-resumenpedido">
        <div className="detail-resumenPedido">
          <div className="container-client-typepay">
            <div className="detail">
              <p>
                <span className="bold">Cliente: </span>
                <span className="capitalize"> {data.client[0].name}</span>
              </p>
            </div>
            <div className="detail">
              <p>
                <span className="bold">Tipo de Pago: </span>
                <span className="capitalize"> {data.type_pay[0].name}</span>
              </p>
            </div>
          </div>

          <div className="container-total">
            <p className="subtotal">
              <span className="bold">SubTotal:</span>${subTotal.toFixed(2)}
            </p>
            {list[0].type_list_id === 2 ? (
              <p className="iva">
                <span className="bold">IVA:</span> ${iva.toFixed(2)}
              </p>
            ) : null}
            <p className="total">
              <span className="bold">Total:</span> ${total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="buttons-infopedido">
          <Button
            className="btn btn-danger"
            color="secondary"
            onClick={toggleModal}
          >
            Atrás
          </Button>
          <Button
            className="btn btn-success"
            color="primary"
            onClick={() => confirmarPedido()}
          >
            Confirmar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ResumenPedido;
