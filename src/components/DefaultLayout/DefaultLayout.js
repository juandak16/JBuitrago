import React, { Suspense, useContext, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import { ListProducts } from "../ListProducts/ListProducts";
import { ListItems } from "../Items/ListItems";
import { ListClients } from "../Clients/ListClients";
import { ListUsers } from "../Users/ListUsers";
import { Config } from "../Config/Config";
import Profile from "../Profile/Profile";
import { ListOrders } from "../ListOrders/ListOrders";
import { AppHeader } from "@coreui/react";
import DefaultHeader from "./DefaultHeader";
import { Auth } from "../../firebase";
// routes config
import routes from "../../routes";
/*const ListProducts = React.lazy(() =>
  import("../../components/ListProducts/ListProducts")
);*/

const DefaultLayout = (props) => {
  const auth = useContext(Auth);

  useEffect(() => {}, []);

  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  const signOut = async (e) => {
    await auth
      .auth()
      .signOut()
      .then(async () => {
        auth.sesion = null;
        props.history.push("/login");
        console.log("salio");
      })
      .catch(function (error) {
        // An error happened.
      });
    e.preventDefault();
  };

  return auth.sesion ? (
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
                  render={(props) => <ListItems {...props} />}
                />
                <Route
                  exact
                  path="/clientes"
                  name="Clientes"
                  render={(props) => <ListClients {...props} />}
                />
                <Route
                  exact
                  path="/usuarios"
                  name="Usuarios"
                  render={(props) => <ListUsers {...props} />}
                />
                <Route
                  exact
                  path="/perfil"
                  name="Perfil"
                  render={(props) => (
                    <Profile {...props} id={auth.sesion.uid} />
                  )}
                />
                <Route
                  exact
                  path="/config"
                  name="Config"
                  render={(props) => <Config {...props} />}
                />
              </Switch>
            </Suspense>
          </Container>
        </main>
      </div>
    </div>
  ) : (
    <Redirect from="/" to="/login" />
  );
};

export default DefaultLayout;
