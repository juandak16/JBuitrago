import React from "react";
import { Button } from "reactstrap";

const ClientRow = (props) => {
  const { client, toggleEdit } = props;
  return (
    <tr key={client.id.toString()}>
      <th className="capitalize center-tab">
        {client.rif_type}-{client.rif_number}
      </th>
      <td className="capitalize center-tab" style={{ minWidth: 300 }}>
        {client.name}
      </td>
      <td className=" capitalize center-tab">{client.city}</td>
      <td className="capitalize center-tab">{client.phone}</td>
      <td className="actions-buttons">
        <Button
          className="btn btn-warning"
          style={{ minWidth: 92 }}
          color="warning"
          onClick={() => toggleEdit(client)}
        >
          Editar
        </Button>
      </td>
    </tr>
  );
};

export default ClientRow;
