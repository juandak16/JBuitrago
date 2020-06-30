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
import { GET_ALL_CLIENTS } from "../../constants/queries";
import ClientRow from "./ClientRow/ClientRow";
import CrudClient from "./CrudClient/CrudClient";
import debounce from "lodash/debounce";

export const ListClients = (props) => {
  const [filterValue, setFilterValue] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_CLIENTS(gql, filterValue, searchValue)
  );
  const [isEditClient, setIsEditClient] = useState(false);
  const [clientEdit, setClientEdit] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [dropdownState, setDropdownState] = useState(false);
  const inputSearch = useRef(null);

  useEffect(() => {
    if (data) getFilter();
  }, [data]);

  useEffect(() => {
    setIsEditClient(isEditClient);
  }, []);

  const toggleEditItem = (client) => {
    setIsEditClient(!isEditClient);
    setClientEdit(client);
  };
  const getFilter = () => {
    let array = [];

    if (!cityList.length) {
      let band;
      client.map((item) => {
        band = false;
        array.map((city) => {
          if (item.city === city) {
            band = true;
          }
        });

        if (band === false) {
          array.push(item.city);
        }
      });
      setCityList(array);
    }
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

  const toggleDropDown = () => {
    setDropdownState(!dropdownState);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { client } = data;

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={12}>
          <Card className="card-infopedido">
            <CardHeader>
              <h2 className="title-list">Lista de Clientes</h2>
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {isEditClient ? (
                <CrudClient
                  isOpenModal={isEditClient}
                  toggleModal={toggleEditItem}
                  client={clientEdit}
                  refetchClient={refetch}
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-actions-items">
                  <Button
                    className="btn btn-success"
                    color="success"
                    onClick={() => toggleEditItem(0)}
                  >
                    Agregar Cliente
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
              <Table responsive striped>
                <thead>
                  <tr>
                    <th scope="col" className="center-tab">
                      Rif
                    </th>
                    <th scope="col" className="center-tab">
                      Nombre
                    </th>
                    <th scope="col" className="center-tab">
                      Ciudad
                    </th>
                    <th scope="col" className="center-tab">
                      Telefono
                    </th>
                    <th scope="col" className="action-title">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {client.map((client, index) => (
                    <ClientRow
                      key={index}
                      client={client}
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
