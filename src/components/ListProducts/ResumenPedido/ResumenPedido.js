import React, { useState, useEffect, useContext } from "react";
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
import { Auth } from "../../../firebase";
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
  mutation PostDetailOrder(
    $order_id: Int
    $count: Int
    $total: numeric
    $product_id: Int
    $price: numeric
  ) {
    insert_detail_order(
      objects: {
        order_id: $order_id
        count: $count
        total: $total
        product_id: $product_id
        price: $price
      }
    ) {
      returning {
        id
        total
        price
        product_id
        order_id
      }
    }
  }
`;

const ResumenPedido = (props) => {
  const { isOpenModal, toggleModal, toggleModalInfo, getObject } = props;
  const [state, setState] = useState("initial");
  const [postOrder] = useMutation(POST_ORDER);
  const [postDetailOrder] = useMutation(POST_DETAIL_ORDER);
  const [pedidoObject, setPedidoObject] = useState(getObject());
  const { client_id, typePay_id, list } = pedidoObject;
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [iva, setIva] = useState(0);
  const auth = useContext(Auth);
  useEffect(() => {
    sumTotal();
  }, []);

  const confirmarPedido = async () => {
    setState("loading");
    let object = {};
    object.type_list_id = list[0].type_list_id;
    object.client_id = client_id;
    object.user_id = auth.sesion.uid;
    object.status_order_id = 1; //status pending
    object.type_pay_id = typePay_id;
    object.total_order = total.toString();
    object.subtotal_order = subTotal.toString();
    if (list[0].type_list_id === 2) {
      object.iva_order = iva.toString();
    }
    console.log(list);

    await postOrder({ variables: { object } }).then((response) => {
      list.map(async (detail, index) => {
        await postDetailOrder({
          variables: {
            product_id: detail.id,
            order_id: response.data.insert_order.returning[0].id,
            count: detail.count,
            total: detail.total,
            price: detail.price,
          },
        });
      });
    });

    toggleModal();
    toggleModalInfo();
    setState("initial");
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
              <ProductRowResumen key={index} item={item} />
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
            disabled={state === "loading"}
          >
            Confirmar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ResumenPedido;
