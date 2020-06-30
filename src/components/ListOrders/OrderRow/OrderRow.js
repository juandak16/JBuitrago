import React, { useEffect } from "react";

const OrderRow = (props) => {
  const { order, toggleViewDetail } = props;
  const toggleDetailOrder = (id) => {};
  const date = order.date ? new Date(order.date) : null;

  const getDate = (timestamp) => {
    let stringDate;
    if (timestamp) {
      let date = timestamp.getDate();
      let month = timestamp.getMonth();
      let year = timestamp.getFullYear();
      stringDate = date + "-" + (month + 1) + "-" + year;
      return stringDate;
    }
    return null;
  };

  const getStatus = () => {
    switch (order.status_order_id) {
      case 1:
        return "btn-danger";
      case 2:
        return "btn-warning ";
      case 3:
        return "btn-primary";
      case 4:
        return "btn-success";
      case 5:
        return "btn-secondary";
    }
  };

  return (
    <tr key={order.id.toString()}>
      <th scope="row" className="center-tab">
        <div>{order.id}</div>
      </th>
      <td className="capitalize center-tab">{order.client.name}</td>
      <td className="capitalize center-tab">{order.user.name}</td>
      <td className="center-tab">{getDate(date)}</td>
      <td className="center-tab">${order.total_order.toFixed(2)}</td>
      <td className="center-tab">
        <button
          onClick={() => toggleViewDetail(order.id)}
          type="button"
          className={`btn btn-status ${getStatus()} `}
        >
          {order.status_order.name}
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
