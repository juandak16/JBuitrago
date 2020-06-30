import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_CLIENTS } from "../../constants/queries";
import ClientRow from "./PersonalRow/ClientRow";
import CrudClient from "./CrudPersonal/CrudClient";

export const ListClients = (props) => {
  const { loading, error, data } = useQuery(GET_ALL_CLIENTS(gql));
  const [isEditClient, setIsEditClient] = useState(false);
  const [clientEdit, setClientEdit] = useState(null);

  useEffect(() => {
    setIsEditClient(isEditClient);
  }, []);

  const toggleEditItem = (client) => {
    setIsEditClient(!isEditClient);
    setClientEdit(client);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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
                  {data.client.map((client, index) => (
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
