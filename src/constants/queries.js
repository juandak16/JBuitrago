export const GET_PRODUCTS = (gql, list_id) => gql`
  query getProducts{
    product(where: { type_list: { id: { _eq: ${list_id} } } }) {
      id
      code
      description
      trademark
      price
      type_list_id
    }
  }
`;

export const GET_INFO_PEDIDO = (gql) => gql`
  {
    client {
      id
      name
    }
    type_pay {
      id
      name
    }
  }
`;

export const GET_RESUMEN_PEDIDO = (gql, client_id, typePay_id) => gql`
  {
    client(where: { id: { _eq: ${client_id} } }) {
      id
      name
      address
    }
    type_pay(where: { id: { _eq: ${typePay_id} } }) {
      id
      name
      description
      descount
    }
  }
`;
