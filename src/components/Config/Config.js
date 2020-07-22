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
import { GET_CONFIG } from "../../constants/queries";
import PayRow from "./PayRow/PayRow";
import TypeRow from "./TypeRow/TypeRow";
import CrudPay from "./CrudPay/CrudPay";
import CrudType from "./CrudType/CrudType";
import debounce from "lodash/debounce";

export const Config = (props) => {
  const [filterValue, setFilterValue] = useState(null);
  const [filterValueTwo, setFilterValueTwo] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [searchValueTwo, setSearchValueTwo] = useState(null);
  const { loading, error, data, refetch } = useQuery(
    GET_CONFIG(gql, filterValue, filterValueTwo, searchValue, searchValueTwo)
  );
  const [isEditPay, setIsEditPay] = useState(false);
  const [payEdit, setPayEdit] = useState(null);

  const [isEditType, setIsEditType] = useState(false);
  const [typeEdit, setTypeEdit] = useState(null);

  const [cityList, setCityList] = useState([]);
  const [dropdownState, setDropdownState] = useState(false);
  const [dropdownStateTwo, setDropdownStateTwo] = useState(false);
  const inputSearch = useRef(null);
  const inputSearchTwo = useRef(null);

  /*useEffect(() => {
    if (data) getFilter();
  }, [data]);*/

  const toggleEditPay = (item) => {
    setIsEditPay(!isEditPay);
    setPayEdit(item);
  };

  const toggleEditType = (item) => {
    setIsEditType(!isEditType);
    setTypeEdit(item);
  };

  /*const getFilter = () => {
    let array = [];

    if (!cityList.length) {
      let band;
      client.map((item) => {
        band = false;
        array.map((city) => {
          if (item.city === city) {
            band = true;
          }
          return null;
        });

        if (band === false) {
          array.push(item.city);
        }
        return null;
      });
      setCityList(array);
    }
  };*/
  const filter = (item) => {
    setFilterValue(item);
    refetch();
    toggleDropDown();
  };
  const filterTwo = (item) => {
    setFilterValueTwo(item);
    refetch();
    toggleDropDownTwo();
  };

  const search = () => {
    setSearchValue(inputSearch.current.value);
    refetch();
    setTimeout(() => {
      if (inputSearch.current) inputSearch.current.focus();
    }, 1000);
  };

  const searchTwo = () => {
    setSearchValueTwo(inputSearchTwo.current.value);
    refetch();
    setTimeout(() => {
      if (inputSearchTwo.current) inputSearchTwo.current.focus();
    }, 1000);
  };

  const toggleDropDown = () => {
    setDropdownState(!dropdownState);
  };
  const toggleDropDownTwo = () => {
    setDropdownStateTwo(!dropdownStateTwo);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { type_pay, type_product } = data;

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={6}>
          <Card className="card-infopedido">
            <CardHeader>
              <h3 className="title-list">Tipos de Pago</h3>
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {isEditPay ? (
                <CrudPay
                  isOpenModal={isEditPay}
                  toggleModal={toggleEditPay}
                  item={payEdit}
                  refetchPay={refetch}
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-actions-items">
                  <Button
                    className="btn btn-success"
                    color="success"
                    onClick={() => toggleEditPay(0)}
                  >
                    Agregar Pago
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
                      {cityList.map((item, index) => (
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
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th scope="col" className="center-tab">
                      Nombre
                    </th>
                    <th scope="col" className="center-tab">
                      Descuento
                    </th>
                    <th scope="col" className="center-tab">
                      Iva
                    </th>
                    <th scope="col" className="action-title">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {type_pay.map((pay, index) => (
                    <PayRow key={index} item={pay} toggleEdit={toggleEditPay} />
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        <Col xl={6}>
          <Card className="card-infopedido">
            <CardHeader>
              <h3 className="title-list">Tipos de Producto</h3>
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {isEditType ? (
                <CrudType
                  isOpenModal={isEditType}
                  toggleModal={toggleEditType}
                  item={typeEdit}
                  refetchType={refetch}
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-actions-items">
                  <Button
                    className="btn btn-success"
                    color="success"
                    onClick={() => toggleEditType(0)}
                  >
                    Agregar Tipo
                  </Button>
                </div>
                <div className="nav-filter">
                  <Dropdown
                    isOpen={dropdownStateTwo}
                    toggle={toggleDropDownTwo}
                    className="dropdown-filter"
                  >
                    <DropdownToggle tag="span" data-toggle="dropdown" caret>
                      <i className="fa fa-filter fa-lg"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Filtrar</DropdownItem>
                      {cityList.map((item, index) => (
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
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th scope="col" className="center-tab">
                      Nombre
                    </th>
                    <th scope="col" className="action-title">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {type_product.map((type, index) => (
                    <TypeRow
                      key={index}
                      item={type}
                      toggleEdit={toggleEditType}
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
