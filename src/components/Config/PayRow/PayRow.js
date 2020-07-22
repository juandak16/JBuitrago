import React from "react";
import { Button } from "reactstrap";

const PayRow = (props) => {
  const { item, toggleEdit } = props;
  return (
    <tr key={item.id.toString()}>
      <th className="capitalize center-tab">{item.name}</th>
      <td className="center-tab" style={{ minWidth: 300 }}>
        {item.descount}%
      </td>
      <td className=" center-tab">{item.iva}%</td>
      <td className="actions-buttons">
        <Button
          className="btn btn-warning"
          style={{ minWidth: 92 }}
          color="warning"
          onClick={() => toggleEdit(item)}
        >
          Editar
        </Button>
      </td>
    </tr>
  );
};

export default PayRow;
