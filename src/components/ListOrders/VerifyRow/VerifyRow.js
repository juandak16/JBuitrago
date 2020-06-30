import React, { useState, useEffect, useRef } from "react";
import { AppSwitch } from "@coreui/react";

const VerifyRow = (props) => {
  const { item, index, sumTotal } = props;

  const [checked, isChecked] = useState(false);
  const checkRef = useRef(null);
  const countRef = useRef(null);
  let product = item.product;
  let count = item.count;

  useEffect(() => {
    item.checked = true;
    item.count = count;
  }, []);

  const countChange = async () => {
    countRef.current.value > 0
      ? (item.count = countRef.current.value)
      : (countRef.current.value = item.count = 1);
    item.total = item.count * product.price;
    await sumTotal();
  };

  const checkedChange = async () => {
    await isChecked(!checked);
    item.checked = checked;
    await sumTotal();
  };

  return (
    <tr key={product.id.toString()}>
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
          defaultValue={count}
          ref={countRef}
          onChange={() => countChange(countRef)}
        />
      </td>

      <td className="center-tab">
        <AppSwitch
          className={"mx-1"}
          variant={"3d"}
          color={"success"}
          defaultChecked
          label
          ref={checkRef}
          dataOn={"\u2713"}
          dataOff={"\u2715"}
          onChange={() => checkedChange()}
        />
      </td>
    </tr>
  );
};

export default VerifyRow;
