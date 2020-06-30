export const GET_PRODUCTS = (gql, list_id, filter, search) => gql`
  query getProducts{
    product(
      limit: 5000 
      order_by: {description: asc} 
      where: {
        _or: [ 
        {code: {_ilike: "%${search}%"}},
        {description: {_ilike: "%${search}%"}},
        {trademark: {${search !== null ? `_ilike: "%${search}%"` : ""}}}
        ],
        type: {${filter !== null ? `_eq: "${filter}"` : ""}},
        type_list: { id: { _eq: ${list_id} } },
        state: {_eq: true}
      }
    ) {
      id
      code
      description
      trademark
      price
      type_list_id
      type
    }
  }
`;

export const GET_ALL_PRODUCTS = (gql, filter, search) => gql`
  query getProducts {
    product(
      limit: 5000
      order_by: { description: asc }
      where: {_or: [ 
        {code: {_ilike: "%${search}%"}},
        {description: {_ilike: "%${search}%"}},
        {trademark: {
          ${search !== null ? `_ilike: "%${search}%"` : ""}
        }}
      ],
       type: {
        ${filter !== null ? `_eq: "${filter}"` : ""}
       } }
    ) {
      id
      code
      state
      description
      trademark
      price
      type
      type_list_id
      type_list {
        abbreviate
      }
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

export const GET_ORDERS = (gql, list_id, filter, search) => gql`
  query getOrders {
    order(
      where: { 
        _or: [ 
        {client: {name: {_ilike: "%${search}%"}}},
        {user: {name: {_ilike: "%${search}%"}}},
        {status_order:{name: {${
          search !== null ? `_ilike: "%${search}%"` : ""
        }}}}
        ],
        status_order:{name: {${filter !== null ? `_eq: "${filter}"` : ""}}},
        type_list_id: { _eq: ${list_id} } 
      },
      order_by: {id: desc}
    ) {
      id
      user_id
      client_id
      date
      total_order
      status_order_id
      client {
        name
      }
      user {
        name
      }
      status_order {
        name
      }
    }
  }
`;

export const GET_DETAILORDER = (gql, order_id) => gql`
query getDetailOrder {
  order(where: {id: {_eq: ${order_id}}}) {
      id
      client {
        name
        address
        rif_type
        rif_number
      }
      type_pay {
        name
      }
      status_order {
        id
        name
      }
      status_order_id
      user {
        name
      }
      total_order
      date
      detail_orders {
        id
        product {
          id
          code
          description
          price
          trademark
        }
        count
        total
      }
      subtotal_order
      iva_order
      type_list_id
      type_list {
        name
      }
    }
  }
`;
export const GET_LIST = (gql) => gql`
  query getList {
    type_list {
      id
      name
    }
  }
`;

export const GET_ALL_CLIENTS = (gql, filter, search) => gql`
  query getClients {
    client(
      order_by: { name: asc }
       where: {
        _or: [ 
          {name: {_ilike: "%${search}%"}},
          {address: {_ilike: "%${search}%"}},
          {city: {_ilike: "%${search}%"}},
          {rif_type: {_ilike: "%${search}%"}},
          {phone: {${search !== null ? `_ilike: "%${search}%"` : ""}}}
        ],
        city: {${filter !== null ? `_eq: "${filter}"` : ""}}

      }
    ) {
      id
      name
      address
      rif_type
      rif_number
      phone
      city
    }
  }
`;
