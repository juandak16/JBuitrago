import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import { ListProducts } from "../../components/ListProducts/ListProducts";
import { ListOrders } from "../../components/ListOrders/ListOrders";

import { AppHeader } from "@coreui/react";
// routes config
import routes from "../../routes";

const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={(e) => this.signOut(e)} />
          </Suspense>
        </AppHeader>

        <div className="app-body">
          <main className="main">
            <Container fluid className="container-body">
              <Suspense fallback={this.loading()}>
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
                  <Redirect from="/" to="/notaentrega" />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default DefaultLayout;
