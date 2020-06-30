import React, { Component, Suspense, useState, useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import { ListProducts } from "../ListProducts/ListProducts";
import { ListItems } from "../Items/ListItems";
import { ListClients } from "../Clients/ListClients";
import { ListOrders } from "../ListOrders/ListOrders";
import { AppHeader } from "@coreui/react";
import DefaultHeader from "./DefaultHeader";
import { Auth } from "../../firebase";
// routes config
import routes from "../../routes";
/*const ListProducts = React.lazy(() =>
  import("../../components/ListProducts/ListProducts")
);*/

const DefaultLayout = () => {
  const [logout, setLogout] = useState(false);
  const auth = useContext(Auth);
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  const signOut = (e) => {
    auth
      .auth()
      .signOut()
      .then(function () {
        console.log("salio");
      })
      .catch(function (error) {
        // An error happened.
      });
    e.preventDefault();
    setLogout(true);
  };

  return (
    <div className="app">
      <AppHeader fixed>
        <Suspense fallback={() => loading()}>
          <DefaultHeader onLogout={(e) => signOut(e)} />
        </Suspense>
      </AppHeader>

      <div className="app-body">
        <main className="main">
          <Container fluid className="container-body">
            <Suspense fallback={() => loading()}>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props) => <route.component {...props} />}
                    />
                  ) : null;
                })}

                <Route
                  exact
                  path="/notaentrega"
                  name="Nota Entrega"
                  render={(props) => <ListProducts {...props} list_id="1" />}
                />
                <Route
                  exact
                  path="/facturafiscal"
                  name="Factura Fiscal"
                  render={(props) => <ListProducts {...props} list_id="2" />}
                />
                <Route
                  exact
                  path="/pedidosne"
                  name="Pedidos Nota Entrega"
                  render={(props) => <ListOrders {...props} list_id="1" />}
                />
                <Route
                  exact
                  path="/pedidosff"
                  name="Pedidos Factura Fiscal"
                  render={(props) => <ListOrders {...props} list_id="2" />}
                />
                <Route
                  exact
                  path="/productos"
                  name="Productos"
                  render={(props) => <ListItems />}
                />
                <Route
                  exact
                  path="/clientes"
                  name="Clientes"
                  render={(props) => <ListClients />}
                />
                {logout ? <Redirect from="/" to="/login" /> : null}
                <Redirect from="/" to="/notaentrega" />
              </Switch>
            </Suspense>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
