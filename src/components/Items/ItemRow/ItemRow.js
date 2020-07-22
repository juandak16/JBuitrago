import React from "react";
import { Button } from "reactstrap";

const ItemRow = (props) => {
  const { product, toggleEdit } = props;
  return (
    <tr key={product.id.toString()}>
      <td className="center-tab">{product.type_list.abbreviate}</td>
      <th scope="row" className="center-tab">
        <div>{product.code}</div>
      </th>
      <td className="capitalize center-tab">{product.description}</td>
      <td className="capitalize center-tab">{product.trademark}</td>
      <td className="center-tab">${product.price.toFixed(2)}</td>
      <td className="actions-buttons">
        {product.state ? (
          <Button
            className="btn btn-success"
            style={{ minWidth: 92 }}
            color="success"
            onClick={() => toggleEdit(product)}
          >
            Disponible
          </Button>
        ) : (
          <Button
            className="btn btn-Secundary"
            style={{ minWidth: 92 }}
            color="secondary"
            onClick={() => toggleEdit(product)}
          >
            Oculto
          </Button>
        )}
      </td>
    </tr>
  );
};

export default ItemRow;
