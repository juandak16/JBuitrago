import React, { useState, useContext, useEffect, useRef } from "react";
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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_PRODUCTS } from "../../constants/queries";
import InfoPedido from "./InfoPedido/InfoPedido";
import ProductRow from "./ProductRow/ProductRow";
import CrudItem from "../Items/CrudItem/CrudItem";
import debounce from "lodash/debounce";

import { Auth } from "../../firebase";

export const ListProducts = (props) => {
  const [filterValue, setFilterValue] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [pages, setPages] = useState(0);
  const { loading, error, data, refetch } = useQuery(
    GET_PRODUCTS(gql, props.list_id, filterValue, searchValue, page, limit)
  );
  const [clear, setClear] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAddItem, setIsAddItem] = useState(false);
  const [idEdit, setIdEdit] = useState(null);
  const [dropdownState, setDropdownState] = useState(false);
  const [typesList, setTypesList] = useState([]);
  const inputSearch = useRef(null);
  const auth = useContext(Auth);

  useEffect(() => {
    setPage(0);
    setPages(0);
  }, [props.list_id]);

  const getPages = () => {
    let countPages = product_aggregate.aggregate.count / limit;
    countPages ? setPages(countPages) : setPages(1);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { product, product_aggregate, type_product } = data;
  const changePage = (value) => {
    setPage(value);

    console.log(limit, "-", page, "-", pages);
    refetch();
  };

  const filter = (item) => {
    setPage(0);
    setPages(0);
    item ? setFilterValue(item.name) : setFilterValue(null);
    refetch();
    toggleDropDown();
  };
  const search = () => {
    setSearchValue(inputSearch.current.value);
    refetch();
    setTimeout(() => {
      if (inputSearch.current) inputSearch.current.focus();
    }, 1000);
    setPages(0);
    setPage(0);
  };

  const toggleDropDown = () => {
    setDropdownState(!dropdownState);
  };

  const changePassword = async () => {
    auth.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
      } else {
        console.log(user);
      }
    });
  };

  const generarPedido = () => {
    setIsOpenModal(!isOpenModal);
  };
  const toggleAddItem = (id) => {
    setIsAddItem(!isAddItem);
    console.log(id);
    setIdEdit(id);
  };

  const cleanLocalStorage = () => {
    localStorage.clear();
    Object.keys(localStorage).map((item, index) => {
      const array = item.split("-");
      if (array[array.length - 1] === props.list_id) {
        localStorage.removeItem(item);
      }
      return 0;
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
      return 0;
    });
    return list;
  };

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={12}>
          <Card className="card-infopedido">
            <CardHeader>
              {props.list_id === "1" ? (
                <h2 className="title-list">Lista por Nota de Entrega</h2>
              ) : (
                <h2 className="title-list">Lista por Factura Fiscal</h2>
              )}
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {isOpenModal ? (
                <InfoPedido
                  isOpenModal={isOpenModal}
                  toggleModal={generarPedido}
                  list={calcuList()}
                />
              ) : null}
              {isAddItem ? (
                <CrudItem
                  isOpenModal={isAddItem}
                  toggleModal={toggleAddItem}
                  id={idEdit}
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-actions">
                  <button
                    onClick={generarPedido}
                    type="button"
                    className="btn btn-success "
                  >
                    Generar Pedido
                  </button>
                  <button
                    onClick={cleanLocalStorage}
                    type="button"
                    className="btn btn-danger"
                  >
                    Limpiar
                  </button>
                </div>
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
                      {type_product.map((item, index) => (
                        <div
                          style={{ textTransform: "capitalize" }}
                          className="dropdown-item"
                          key={index}
                          onClick={() => filter(item)}
                        >
                          {item.name}
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
                      Descripción
                    </th>
                    <th scope="col" className="center-tab">
                      Marca
                    </th>
                    <th scope="col" className="center-tab">
                      Precio (USD)
                    </th>
                    <th scope="col" className="center-tab">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((product, index) => (
                    <ProductRow
                      key={index}
                      product={product}
                      clear={clear}
                      toggleAdd={toggleAddItem}
                    />
                  ))}
                </tbody>
              </Table>
              {pages ? (
                <Pagination className="pagination">
                  <PaginationItem disabled={page === 0}>
                    <PaginationLink
                      previous
                      tag="button"
                      onClick={() => changePage(page - 1)}
                    />
                  </PaginationItem>

                  {page > 1 ? (
                    <PaginationItem>
                      <PaginationLink
                        tag="button"
                        onClick={() => changePage(page - 2)}
                      >
                        {page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null}
                  {page > 0 ? (
                    <PaginationItem>
                      <PaginationLink
                        tag="button"
                        onClick={() => changePage(page - 1)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null}

                  <PaginationItem active>
                    <PaginationLink
                      tag="button"
                      onClick={() => changePage(page)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>

                  {page < pages - 1 ? (
                    <PaginationItem>
                      <PaginationLink
                        tag="button"
                        onClick={() => changePage(page + 1)}
                      >
                        {page + 2}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null}

                  {page < pages - 2 ? (
                    <PaginationItem>
                      <PaginationLink
                        tag="button"
                        onClick={() => changePage(page + 2)}
                      >
                        {page + 3}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null}

                  <PaginationItem disabled={page >= pages - 1}>
                    <PaginationLink
                      next
                      tag="button"
                      onClick={() => changePage(page + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              ) : (
                getPages()
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
