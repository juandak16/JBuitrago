import React, { useState, useEffect, useRef } from "react";

const ProductRowInfo = (props) => {
  const { item, deleteItem, index, list } = props;
  const product = props.item;
  const [deleteProductOnCar, setDeleteProductOnCar] = useState(false);
  const count = useRef(null);

  useEffect(() => {
    item.count = 1;
    list.indexOf(item) >= 0
      ? setDeleteProductOnCar(false)
      : setDeleteProductOnCar(true);
  }, []);

  const countChange = () => {
    item.count = count.current.value;
  };

  const deleteProduct = (item) => {
    deleteItem(item);
    setDeleteProductOnCar(true);
  };

  return !deleteProductOnCar ? (
    <tr key={product.id}>
      <th scope="row" className="center-tab">
        <div>{product.code}</div>
      </th>
      <td className="capitalize center-tab">{product.description}</td>
      <td className="capitalize center-tab">{product.trademark}</td>
      <td className="center-tab">${product.price.toFixed(2)}</td>
      <td className="center-tab">
        <input
          accessKey={index}
          type="number"
          className="input-count"
          aria-label="cantidad"
          aria-describedby="basic-addon1"
          defaultValue="1"
          ref={count}
          onChange={() => countChange(count)}
        />
      </td>
      <td className="actions-buttons-info">
        <button
          onClick={() => deleteProduct(item)}
          type="button"
          className="btn btn-danger button-action-info"
        >
          ×
        </button>
      </td>
    </tr>
  ) : null;
};

export default ProductRowInfo;
