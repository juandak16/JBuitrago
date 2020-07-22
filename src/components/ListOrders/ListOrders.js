import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_ORDERS } from "../../constants/queries";
import OrderRow from "./OrderRow/OrderRow";
import DetailOrder from "./DetailOrder/DetailOrder";
import debounce from "lodash/debounce";

export const ListOrders = (props) => {
  const { list_id } = props;
  const [filterValue, setFilterValue] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [viewDetailOrder, setViewDetailOrder] = useState(false);
  const { loading, error, data, refetch } = useQuery(
    GET_ORDERS(gql, list_id, filterValue, searchValue)
  );
  const [dropdownState, setDropdownState] = useState(false);
  const [stateList, setStateList] = useState([]);
  const inputSearch = useRef(null);

  const getFilter = () => {
    let array = [];

    if (!stateList.length) {
      let band;
      order.map((item) => {
        band = false;

        array.map((state) => {
          if (item.status_order.name === state) {
            band = true;
          }
          return null;
        });

        if (band === false) {
          array.push(item.status_order.name);
        }
        return null;
      });
      setStateList(array);
    }
  };
  useEffect(() => {
    if (data) getFilter();
  }, [data]);

  const filter = (item) => {
    setFilterValue(item);
    refetch();
    toggleDropDown();
  };
  const search = () => {
    setSearchValue(inputSearch.current.value);
    refetch();
    setTimeout(() => {
      if (inputSearch.current) inputSearch.current.focus();
    }, 1000);
  };

  const toggleDropDown = () => {
    setDropdownState(!dropdownState);
  };
  const [order_id, setOrder_id] = useState(0);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { order } = data;

  const toggleViewDetail = (id) => {
    setOrder_id(id);
    setViewDetailOrder(!viewDetailOrder);
  };

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={12}>
          <Card className="card-infopedido">
            <CardHeader>
              {props.list_id === "1" ? (
                <h2 className="title-list">Pedidos por Nota de Entrega</h2>
              ) : (
                <h2 className="title-list">Pedidos por Factura Fiscal</h2>
              )}
            </CardHeader>
            <CardBody className="cardbody-orderproducts">
              {viewDetailOrder ? (
                <DetailOrder
                  isOpenModal={viewDetailOrder}
                  toggleModal={toggleViewDetail}
                  order_id={order_id}
                  //order_id="93"
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-filter">
                  <Dropdown
                    isOpen={dropdownState}
                    toggle={toggleDropDown}
                    className="dropdown-filter"
                  >
                    <DropdownToggle tag="span" data-toggle="dropdown" caret>
                      <i className="fa fa-filter fa-lg"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Filtrar</DropdownItem>
                      {stateList.map((item, index) => (
                        <div
                          style={{ textTransform: "capitalize" }}
                          className="dropdown-item"
                          key={index}
                          onClick={() => filter(item)}
                        >
                          {item}
                        </div>
                      ))}
                      <DropdownItem onClick={() => filter(null)}>
                        TODOS
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
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
                      defaultValue={searchValue}
                      ref={inputSearch}
                      onChange={debounce(() => search(), 1000)}
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
                  {order.map((order, index) => (
                    <OrderRow
                      key={index}
                      order={order}
                      toggleViewDetail={toggleViewDetail}
                    />
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
