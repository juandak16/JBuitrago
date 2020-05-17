export const POST_DETAILORDER = (gql, detailOrder) => gql``;

export const POST_ORDER = (order, gql) => gql`
  mutation PostOrder($object: ${order}) {
    insert_order(objects: $object) {
      returning {
        id
      }
    }
  }
`;
