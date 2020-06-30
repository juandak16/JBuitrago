import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./views/Pages/Register";
import Page404 from "./views/Pages/Page404";
import Page500 from "./views/Pages/Page500";
import DefaultLayout from "./components/DefaultLayout";
import "./App.scss";

// for apollo client
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { firebaseInstance } from "./firebase";
import { Auth } from "./firebase";
//import { setContext } from "apollo-link-context";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

function App() {
  // for apollo client
  const httpLink = new HttpLink({
    uri: `https://jbuitrago-api.herokuapp.com/v1/graphql`,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return (
    <HashRouter>
      <ApolloProvider client={client}>
        <Auth.Provider value={firebaseInstance}>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/register"
                name="Register Page"
                render={(props) => <Register {...props} />}
              />
              <Route
                exact
                path="/404"
                name="Page 404"
                render={(props) => <Page404 {...props} />}
              />
              <Route
                exact
                path="/500"
                name="Page 500"
                render={(props) => <Page500 {...props} />}
              />
              <Route
                path="/"
                name="Home"
                render={(props) => <DefaultLayout {...props} />}
              />
            </Switch>
          </React.Suspense>
        </Auth.Provider>
      </ApolloProvider>
    </HashRouter>
  );
}

export default App;
