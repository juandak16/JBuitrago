import React from "react";
import { Button } from "reactstrap";

const UserRow = (props) => {
  const { user, toggleEdit } = props;
  return (
    <tr key={user.id.toString()}>
      <th className="capitalize center-tab" style={{ minWidth: 100 }}>
        {user.rif_type}-{user.rif_number}
      </th>
      <td className="capitalize center-tab" style={{ minWidth: 300 }}>
        {user.name}
      </td>
      <td className="center-tab">{user.email}</td>
      <td className=" capitalize center-tab">{user.role}</td>
      <td className="capitalize center-tab">{user.phone}</td>
      <td className="actions-buttons">
        <Button
          className="btn btn-warning"
          style={{ minWidth: 92 }}
          color="warning"
          onClick={() => toggleEdit(user)}
        >
          Editar
        </Button>
      </td>
    </tr>
  );
};

export default UserRow;
