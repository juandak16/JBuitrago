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
} from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_PRODUCTS } from "../../constants/queries";
import InfoPedido from "../ListProducts/InfoPedido/InfoPedido";
import ItemRow from "./ItemRow/ItemRow";
import CrudItem from "./CrudItem/CrudItem";
import debounce from "lodash/debounce";

export const ListItems = (props) => {
  const [filterValue, setFilterValue] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_PRODUCTS(gql, filterValue, searchValue)
  );
  const [isEditItem, setIsEditItem] = useState(false);
  const [productEdit, setProductEdit] = useState(null);
  const [dropdownState, setDropdownState] = useState(false); //-----
  const [typesList, setTypesList] = useState([]); //----
  const inputSearch = useRef(null);
  const getFilter = () => {
    //------------
    let array = [];

    if (!typesList.length) {
      let band;
      product.map((item) => {
        band = false;

        array.map((type) => {
          if (item.type === type) {
            band = true;
          }
        });

        if (band === false) {
          array.push(item.type);
        }
      });
      setTypesList(array);
    }
  };

  useEffect(() => {
    //----------
    if (data) getFilter();
  }, [data]);

  useEffect(() => {
    //-----------
    setIsEditItem(isEditItem);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { product } = data;

  const toggleEditItem = (item) => {
    setIsEditItem(!isEditItem);
    setProductEdit(item);
  };

  const toggleDropDown = () => {
    setDropdownState(!dropdownState);
  };

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
                      {typesList.map((item, index) => (
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
