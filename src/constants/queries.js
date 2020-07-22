export const GET_PRODUCTS = (gql, list_id, filter, search, page, limit) => gql`
  query getProducts{
    product(
      limit: ${limit}
      order_by: {description: asc} 
      offset: ${page * limit} 
      where: {
        _or: [ 
        {code: {_ilike: "%${search}%"}},
        {description: {_ilike: "%${search}%"}},
        {trademark: {${search !== null ? `_ilike: "%${search}%"` : ""}}}
        ],
        type_product: {${filter !== null ? `_eq: "${filter}"` : ""}},
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
      type_product
    }
    product_aggregate(where: {
        _or: [ 
        {code: {_ilike: "%${search}%"}},
        {description: {_ilike: "%${search}%"}},
        {trademark: {${search !== null ? `_ilike: "%${search}%"` : ""}}}
        ],
        type_product: {${filter !== null ? `_eq: "${filter}"` : ""}},
        type_list: { id: { _eq: ${list_id} } },
        state: {_eq: true}
      }) {
      aggregate {
        count
      }
    }
    type_product{
      id 
      name
    }
  }
`;

export const GET_ALL_PRODUCTS = (gql, filter, search, page, limit) => gql`
  query getProducts {
    product(
      limit: ${limit}
      order_by: { description: asc }
      offset: ${page * limit} 
      where: {_or: [ 
        {code: {_ilike: "%${search}%"}},
        {description: {_ilike: "%${search}%"}},
        {trademark: {
          ${search !== null ? `_ilike: "%${search}%"` : ""}
        }}
      ],
       type_product: {
        ${filter !== null ? `_eq: "${filter}"` : ""}
       } }
    ) {
      id
      code
      state
      description
      trademark
      price
      type_list_id
      type_product
      type_list {
        abbreviate
      }
    }
    product_aggregate(
      where: {
        _or: [ 
          {code: {_ilike: "%${search}%"}},
          {description: {_ilike: "%${search}%"}},
          {trademark: {
            ${search !== null ? `_ilike: "%${search}%"` : ""}
          }}
        ],
        type_product: {
          ${filter !== null ? `_eq: "${filter}"` : ""}
        } 
      }
      ) {
      aggregate {
        count
      }
    }
    type_product{
      id 
      name
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
        price
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
export const GET_CRUD_PRODUCT = (gql) => gql`
  query getList {
    type_list {
      id
      name
    }
    type_product {
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
      user_id
          user {
      name
    }
    }
  }
`;
export const GET_ALL_USERS = (gql, filter, search) => gql`
  query getUsers {
    user {
      address
      id
      name
      rif_number
      rif_type
      phone
      role
      email
    }
  }
`;
export const GET_USER = (gql, id) => gql`
         query getUser {
           user(where: { id: { _eq: "${id}" } }) {
             id
             address
             name
             phone
             rif_number
             rif_type
             role
             email
           }
         }
       `;

export const GET_CONFIG = (
  gql,
  id,
  filter,
  filterTwo,
  search,
  searchTwo
) => gql`
  query getConfig {
    type_pay {
      id
      iva
      name
      descount
    }
    type_product {
      id
      name
    }
  }
`;
