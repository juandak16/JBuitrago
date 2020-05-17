import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_PRODUCTS } from "../../constants/queries";
//import InfoPedido from "./InfoPedido/InfoPedido";
//import ProductRow from "./ProductRow/ProductRow";

export const ListOrders = (props) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS(gql, props.list_id));
  const [clear, setClear] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const generarPedido = () => {
    setIsOpenModal(!isOpenModal);
  };

  const cleanLocalStorage = () => {
    localStorage.clear();
    Object.keys(localStorage).map((item, index) => {
      const array = item.split("-");
      if (array[array.length - 1] === props.list_id) {
        localStorage.removeItem(item);
      }
    });
    setClear(!clear);
  };

  const calcuList = () => {
    let list = [];
    let product;
    Object.values(localStorage).map((item, index) => {
      product = JSON.parse(item);
      if (product.type_list_id == props.list_id) {
        list.push(item);
      }
    });
    return list;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader>
              {props.list_id === "1" ? (
                <h2 className="title-list">Pedidos por Nota de Entrega</h2>
              ) : (
                <h2 className="title-list">Pedidos por Factura Fiscal</h2>
              )}
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {/*isOpenModal ? (
                <InfoPedido
                  isOpenModal={isOpenModal}
                  toggleModal={generarPedido}
                  list={calcuList()}
                />
              ) : null*/}
              <div className="nav-list">
                <div className="nav-filter">
                  <i className="fa fa-filter fa-lg icon-filter"></i>
                  <div className="input-group mb-3 input-search">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="fa fa-search fa-lg icon-search"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar"
                      aria-label="Buscar"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </div>
              </div>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th scope="col" className="center-tab">
                      Código
                    </th>
                    <th scope="col" className="center-tab">
                      Cliente
                    </th>
                    <th scope="col" className="center-tab">
                      Vendedor
                    </th>
                    <th scope="col" className="center-tab">
                      Fecha
                    </th>
                    <th scope="col" className="center-tab">
                      Monto
                    </th>
                    <th scope="col" className="center-tab">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/*data.product.map((product, index) => (
                    <ProductRow key={index} product={product} clear={clear} />
                  ))*/}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
