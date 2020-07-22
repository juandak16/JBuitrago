import React, { useState, useEffect, useRef, useContext } from "react";
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
import { GET_ALL_USERS } from "../../constants/queries";
import UserRow from "./UserRow/UserRow";
import CrudUser from "./CrudUser/CrudUser";
import debounce from "lodash/debounce";
import { Auth } from "../../firebase";

export const ListUsers = (props) => {
  const [filterValue, setFilterValue] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const { loading, error, data, refetch } = useQuery(
    GET_ALL_USERS(gql, filterValue, searchValue)
  );
  const [isEditUser, setIsEditUser] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const [dropdownState, setDropdownState] = useState(false);
  const inputSearch = useRef(null);
  const auth = useContext(Auth);

  useEffect(() => {
    if (data) getFilter();
  }, [data]);

  useEffect(() => {
    setIsEditUser(isEditUser);
  }, [isEditUser]);

  const toggleEditItem = (user) => {
    if (user) {
      if (user.id === auth.sesion.uid) {
        props.history.push("/perfil");
      }
    }
    setIsEditUser(!isEditUser);
    setUserEdit(user);
  };
  const getFilter = () => {
    /*let array = [];

    if (!cityList.length) {
      let band;
      user.map((item) => {
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
    }*/
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
  const { user } = data;

  return (
    <div className="animated fadeIn" key={loading}>
      <Row>
        <Col xl={12}>
          <Card className="card-infopedido">
            <CardHeader>
              <h2 className="title-list">Lista de Usuarios</h2>
            </CardHeader>
            <CardBody className="cardbody-listproducts">
              {isEditUser ? (
                <CrudUser
                  isOpenModal={isEditUser}
                  toggleModal={toggleEditItem}
                  user={userEdit}
                  refetchUser={refetch}
                />
              ) : null}
              <div className="nav-list">
                <div className="nav-actions-items">
                  <Button
                    className="btn btn-success"
                    color="success"
                    onClick={() => toggleEditItem(0)}
                    style={{ minWidth: 127, marginRight: 10 }}
                  >
                    Agregar Usuario
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
                      {/*cityList.map((item, index) => (
                        <div
                          style={{ textTransform: "capitalize" }}
                          className="dropdown-item"
                          key={index}
                          onClick={() => filter(item)}
                        >
                          {item}
                        </div>
                      ))*/}
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
                      Correo
                    </th>
                    <th scope="col" className="center-tab">
                      Rol
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
                  {user.map((user, index) => (
                    <UserRow
                      key={index}
                      user={user}
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
