module.exports = {
  apiUrl: `https://jbuitrago-api.herokuapp.com/v1/graphql`,
  queries: {
    getProducts: `{
      product {
        id
        name
        price
        trademark
        description
      }
    }`,
  },
};
