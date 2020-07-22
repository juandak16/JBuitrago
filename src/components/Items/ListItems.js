import React, { useState, useEffect, useRef } from "react";
import {
  Button,
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
import { GET_ALL_PRODUCTS } from "../../constants/queries";
import ItemRow from "./ItemRow/ItemRow";
import CrudItem from "./CrudItem/CrudItem";
import debounce from "lodash/debounce";

export const ListItems = (props) => {
  const [filterValue, setFilterValue] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [pages, setPages] = useState(0);
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_PRODUCTS(gql, filterValue, searchValue, page, limit)
  );
  const [isEditItem, setIsEditItem] = useState(false);
  const [productEdit, setProductEdit] = useState(null);
  const [dropdownState, setDropdownState] = useState(false); //-----
  const inputSearch = useRef(null);

  const changePage = (value) => {
    setPage(value);
    console.log(limit, "-", page, "-", pages);
    refetch();
  };

  const getPages = () => {
    let countPages = product_aggregate.aggregate.count / limit;
    countPages ? setPages(countPages) : setPages(1);
  };

  useEffect(() => {
    //-----------
    setIsEditItem(isEditItem);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { product, product_aggregate, type_product } = data;

  const toggleEditItem = (item) => {
    setIsEditItem(!isEditItem);
    setProductEdit(item);
  };

  const toggleDropDown = () => {
    setDropdownState(!dropdownState);
  };

  const filter = (item) => {
    setPages(0);
    setPage(0);
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
    setPage(0);
    setPages(0);
  };

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={12}>
          <Card className="card-infopedido">
            <CardHeader>
              <h2 className="title-list">Lista de Productos</h2>
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {isEditItem ? (
                <CrudItem
                  isOpenModal={isEditItem}
                  toggleModal={toggleEditItem}
                  product={productEdit}
                  refetchProduct={refetch}
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-actions-items">
                  <Button
                    className="btn btn-success"
                    color="success"
                    onClick={() => toggleEditItem(0)}
                  >
                    Agregar Producto
                  </Button>
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
                      Lista
                    </th>
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
                    <th scope="col" className="action-title">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((item, index) => (
                    <ItemRow
                      key={index}
                      product={item}
                      toggleEdit={toggleEditItem}
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
