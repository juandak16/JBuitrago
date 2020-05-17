import React, { useState, useEffect } from "react";

const ProductRowInfo = (props) => {
  const { item, deleteItem, index, list } = props;
  const product = props.item;
  const [deleteProductOnCar, setDeleteProductOnCar] = useState(false);

  useEffect(() => {
    item.total = item.count * item.price;
    list.indexOf(item) >= 0
      ? setDeleteProductOnCar(false)
      : setDeleteProductOnCar(true);
  }, []);

  const deleteProduct = (item) => {
    deleteItem(item);
    setDeleteProductOnCar(true);
  };

  return !deleteProductOnCar ? (
    <tr key={product.id.toString()}>
      <th scope="row" className="center-tab">
        <div>{product.code}</div>
      </th>
      <td className="capitalize center-tab">{product.description}</td>
      <td className="capitalize center-tab">{product.trademark}</td>
      <td className="center-tab">${product.price.toFixed(2)}</td>
      <td className="center-tab">{item.count}</td>
      <td className="actions-buttons">
        ${product.total ? product.total.toFixed(2) : null}
      </td>
    </tr>
  ) : null;
};

export default ProductRowInfo;
