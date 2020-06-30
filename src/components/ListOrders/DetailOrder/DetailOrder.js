import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Progress,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
//import ProductRowInfo from "../ProductRowInfo/ProductRowInfo";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_DETAILORDER } from "../../../constants/queries";
import ProductRowResumen from "../../ListProducts/ProductRowResumen/ProductRowResumen";
import ConfirmationModal from "../../ConfirmationModal";
import VerifyRow from "../VerifyRow/VerifyRow";
import InvoicePDF from "../InvoicePDF/InvoicePDF";
export const UPDATE_STATUS_ORDER = gql`
  mutation UpdateStatusOrder($status_id: Int, $id: Int) {
    update_order(
      _set: { status_order_id: $status_id }
      where: { id: { _eq: $id } }
    ) {
      returning {
        status_order_id
      }
    }
  }
`;
export const UPDATE_VERIFY_ORDER = gql`
  mutation UpdateVerifyOrder(
    $status_order_id: Int
    $subtotal_order: numeric
    $total_order: numeric
    $id: Int
    $iva_order: numeric
  ) {
    update_order(
      where: { id: { _eq: $id } }
      _set: {
        iva_order: $iva_order
        status_order_id: $status_order_id
        subtotal_order: $subtotal_order
        total_order: $total_order
      }
    ) {
      returning {
        id
      }
    }
  }
`;
export const UPDATE_VERIFY_DETAIL_ORDER = gql`
  mutation UpdateVerifyOrderDetail($total: numeric, $id: Int, $count: Int) {
    update_detail_order(
      where: { id: { _eq: $id } }
      _set: { count: $count, total: $total }
    ) {
      returning {
        id
      }
    }
  }
`;
export const DELETE_DETAIL_ORDER = gql`
  mutation DeleteDetailOrder($id: Int) {
    delete_detail_order(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

const DetailOrder = (props) => {
  const { isOpenModal, toggleModal, order_id } = props;
  const { loading, error, data, refetch } = useQuery(
    GET_DETAILORDER(gql, order_id)
  );
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isPDF, setIsPDF] = useState(false);
  const [updateStatus] = useMutation(UPDATE_STATUS_ORDER);
  const [UpdateVerifyOrder] = useMutation(UPDATE_VERIFY_ORDER);
  const [UpdateVerifyOrderDetail] = useMutation(UPDATE_VERIFY_DETAIL_ORDER);
  const [DeleteDetailOrder] = useMutation(DELETE_DETAIL_ORDER);
  const [color, setColor] = useState(null);
  const [word, setWord] = useState(null);
  const [total, setTotal] = useState(null);
  const [subTotal, setSubTotal] = useState(null);
  const [iva, setIva] = useState(null);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  let order = data.order[0];
  let {
    client,
    type_pay,
    detail_orders,
    status_order_id,
    subtotal_order,
    total_order,
    iva_order,
  } = order;

  const calcCountChecked = () => {
    let countCheceked = 0;
    detail_orders.map((item) => {
      if (item.checked || item.checked === undefined) {
        countCheceked++;
      }
    });
    return countCheceked;
  };

  const getStateFuture = () => {
    switch (order.status_order_id) {
      case 1:
        return "verificar";
      case 2:
        return "confirmar verificación";
      case 3:
        return "enviar";
      case 4:
        return "continuar";
      case 5:
        return "activar";
    }
  };
  const getColorStateFuture = () => {
    switch (order.status_order_id) {
      case 1:
        return "btn-warning";
      case 2:
        return "btn-primary ";
      case 3:
        return "btn-success";
      case 4:
        return "btn-success";
      case 5:
        return "btn-success";
    }
  };
  const getProgress = () => {
    switch (status_order_id) {
      case 1:
        return (
          <Progress multi className="progress-order">
            <Progress animated bar color="danger" value="25" />
          </Progress>
        );
      case 2:
        return (
          <Progress multi className="progress-order">
            <Progress bar color="danger" value="25" />
            <Progress animated bar color="warning" value="25" />
          </Progress>
        );
      case 3:
        return (
          <Progress multi className="progress-order">
            <Progress bar color="danger" value="25" />
            <Progress bar color="warning" value="25" />
            <Progress animated bar value="25" />
          </Progress>
        );
      case 4:
        return (
          <Progress multi className="progress-order">
            <Progress bar color="danger" value="25" />
            <Progress bar color="warning" value="25" />
            <Progress bar value="25" />
            <Progress bar color="success" value="25" />
          </Progress>
        );
      case 5:
        return (
          <Progress multi className="progress-order">
            <Progress striped bar color="info" value="25" />
          </Progress>
        );
    }
  };

  const changeStatus = async (statusFuture) => {
    let status_id;
    order.status_order_id == 5
      ? (status_id = 1)
      : (status_id = order.status_order_id + 1);

    statusFuture === "anular"
      ? await updateStatus({ variables: { status_id: 5, id: order_id } })
      : statusFuture === "confirmar"
      ? await verify()
      : await updateStatus({
          variables: { status_id: status_id, id: order_id },
        });
    await refetch();
    toggleConfirmationModal();
    //status_id == 2 ? null : toggleModal();
  };

  const toggleConfirmationModal = () => {
    setIsConfirmation(!isConfirmation);
  };
  const confirm = (status_id) => {
    if (status_id == 1) {
      setColor("warning");
      setWord("verificar");
      toggleConfirmationModal();
    }
    if (status_id == 2) {
      let countChecked = calcCountChecked();
      if (countChecked > 0) {
        setColor("primary");
        setWord("confirmar");
        toggleConfirmationModal();
      } else {
        alert("La lista de productos esta vacía");
      }
    }
    if (status_id == 3) {
      setColor("success");
      setWord("enviar");
      toggleConfirmationModal();
    }
    if (status_id == 4) {
      toggleModal();
    }
    if (status_id == 5) {
      setColor("success");
      setWord("activar");
      toggleConfirmationModal();
    }
    if (status_id == 6) {
      setColor("danger");
      setWord("anular");
      toggleConfirmationModal();
    }
  };

  const sumTotal = () => {
    let newSubTotal = 0;
    let newTotal = 0;
    detail_orders.map((item) => {
      if (item.checked || item.checked == undefined) {
        newSubTotal += item.total;
      } else {
        newSubTotal = newSubTotal;
      }
    });
    setSubTotal(newSubTotal);
    setIva(newSubTotal * 0.16);
    if (order.type_list_id === 1) {
      newTotal = newSubTotal;
      setTotal(newTotal);
    }
    if (order.type_list_id === 2) {
      newTotal = newSubTotal * 1.16;
      setTotal(newTotal);
    }
  };

  const verify = async () => {
    await UpdateVerifyOrder({
      variables: {
        status_order_id: 3,
        subtotal_order: subTotal.toString(),
        total_order: total.toString(),
        id: order_id,
        iva_order: iva.toString(),
      },
    });
    detail_orders.map(async (item, index) => {
      item.checked
        ? await UpdateVerifyOrderDetail({
            variables: {
              total: item.total.toString(),
              id: item.id,
              count: item.count,
            },
          })
        : await DeleteDetailOrder({
            variables: {
              id: item.id,
            },
          });
    });
  };

  const generatePDF = () => {
    setIsPDF(!isPDF);
  };
  return !isPDF ? (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-detailorder"
    >
      {isConfirmation ? (
        <ConfirmationModal
          isOpenModal={isConfirmation}
          toggleModal={toggleConfirmationModal}
          color={color}
          word={word}
          confirm={changeStatus}
          wordtwo={"pedido"}
        />
      ) : null}
      <ModalHeader toggle={props.toggleModal} className="header-detailorder">
        Pedido #{order_id}
      </ModalHeader>
      <ModalBody className="modal-body-info">
        {getProgress()}

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
              {status_order_id == 2 ? (
                <th scope="col" className="center-tab">
                  Verificación
                </th>
              ) : (
                <th scope="col" className="center-tab">
                  SubTotal
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {status_order_id == 2
              ? detail_orders.map((item, index) => (
                  <VerifyRow
                    key={index}
                    item={item}
                    index={index}
                    sumTotal={sumTotal}
                    calcCountChecked={calcCountChecked}
                  />
                ))
              : detail_orders.map((item, index) => (
                  <ProductRowResumen
                    key={index}
                    item={item.product}
                    list={detail_orders}
                    count={item.count}
                    subtotal={item.total}
                  />
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
                <span className="capitalize"> {client.name}</span>
              </p>
            </div>
            <div className="detail">
              <p>
                <span className="bold">Tipo de Pago: </span>
                <span className="capitalize"> {type_pay.name}</span>
              </p>
            </div>
          </div>

          {total !== null ? (
            <div className="container-total">
              <p className="subtotal">
                <span className="bold">SubTotal:</span>${subTotal.toFixed(2)}
              </p>
              {order.type_list_id === 2 ? (
                <p className="iva">
                  <span className="bold">IVA:</span> ${iva.toFixed(2)}
                </p>
              ) : null}
              <p className="total">
                <span className="bold">Total:</span> ${total.toFixed(2)}
              </p>
            </div>
          ) : (
            sumTotal()
          )}
        </div>
        <div className="buttons-detailpedido">
          {order.status_order_id == 5 || order.status_order_id == 4 ? (
            <div></div>
          ) : (
            <Button
              className="btn btn-danger"
              color="secondary"
              onClick={() => confirm(6)}
            >
              Anular Pedido
            </Button>
          )}

          <div className="buttons-actiondetailpedido">
            <Button
              className="btn btn-primary"
              color="primary"
              onClick={() => generatePDF()}
            >
              Descargar como PDF
            </Button>
            <Button
              className={`btn capitalize ${getColorStateFuture()}`}
              color="primary"
              onClick={() => confirm(order.status_order_id)}
            >
              {getStateFuture()}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  ) : (
    <Modal
      isOpen={isPDF}
      toggle={generatePDF}
      className="modal-lg modal-detailorder"
    >
      <InvoicePDF order={order} />
    </Modal>
  );
};

export default DetailOrder;
