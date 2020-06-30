import React, { useState, useEffect } from "react";

const ProductRow = (props) => {
  const { product, clear, toggleAdd } = props;
  const [isProductOnCar, setIsProductOnCar] = useState(false);

  useEffect(() => {
    !localStorage.getItem(`detail-order-${product.id}-${product.type_list_id}`)
      ? setIsProductOnCar(false)
      : setIsProductOnCar(true);
  });

  const addItem = (product) => {
    localStorage.setItem(
      `detail-order-${product.id}-${product.type_list_id}`,
      JSON.stringify(product)
    );
    setIsProductOnCar(true);
  };

  const deleteItem = (product) => {
    localStorage.removeItem(
      `detail-order-${product.id}-${product.type_list_id}`
    );
    setIsProductOnCar(false);
  };
  return (
    <tr key={product.id.toString()}>
      <th scope="row" className="center-tab">
        <div>{product.code}</div>
      </th>
      <td className="capitalize center-tab">{product.description}</td>
      <td className="capitalize center-tab">{product.trademark}</td>
      <td className="center-tab">${product.price.toFixed(2)}</td>

      <td className="actions-buttons">
        {!isProductOnCar ? (
          <button
            onClick={() => addItem(product)}
            type="button"
            className="btn btn-success button-action"
          >
            Agregar
          </button>
        ) : (
          <button
            onClick={() => deleteItem(product)}
            type="button"
            className="btn btn-danger button-action"
          >
            Eliminar
          </button>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
