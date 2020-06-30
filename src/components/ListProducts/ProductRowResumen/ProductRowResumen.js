import React, { useState, useEffect } from "react";

const ProductRowResumen = (props) => {
  const { item, list, count, subtotal } = props;
  const product = item;

  useEffect(() => {
    item.total = item.count * item.price;
  }, []);

  return (
    <tr key={product.id.toString()}>
      <th scope="row" className="center-tab">
        <div>{product.code}</div>
      </th>
      <td className="capitalize center-tab">{product.description}</td>
      <td className="capitalize center-tab">{product.trademark}</td>
      <td className="center-tab">${product.price.toFixed(2)}</td>
      {count ? (
        <td className="center-tab">{count}</td>
      ) : (
        <td className="center-tab">{item.count}</td>
      )}
      {subtotal ? (
        <td className="center-tab">${subtotal.toFixed(2)}</td>
      ) : (
        <td className="center-tab">
          ${product.total ? product.total.toFixed(2) : null}
        </td>
      )}
    </tr>
  );
};

export default ProductRowResumen;
