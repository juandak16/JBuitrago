import React from "react";
import { Button } from "reactstrap";

const TypeRow = (props) => {
  const { item, toggleEdit } = props;
  return (
    <tr key={item.id.toString()}>
      <th className="capitalize center-tab">{item.name}</th>

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

export default TypeRow;
