import React, { useRef } from "react";
import {
  Button,
  Table,
  Progress,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const UploadModal = (props) => {
  const { isOpenModal, toggleModal, type_list, confirm } = props;
  const fileRef = useRef(null);
  const listRef = useRef(null);

  const importProducts = () => {
    let read = new FileReader();
    read.onload = (e) => {
      let text = read.result;
      //get all lines
      let lines = text.split("\n");
      let result = [];
      let error = [];
      //get object values
      let headers = lines[0].split("\t");
      for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentLine = lines[i].split("\t");
        let pos = 0;
        obj.type_list_id = listRef.current.value;
        currentLine.map((item) => {
          if (item) {
            if (pos === 4) {
              item = item.substr(1);
            }
            if (pos === 5) {
              item = true;
            }
            if (pos === 6) {
              item = item.trim();
            }
            obj[headers[pos]] = item;
            pos++;
          }
        });
        if (pos > 4) {
          if (pos == 7) {
            result.push(obj);
          } else {
            error.push(obj);
          }
        }
      }
      confirm(result, error);
    };
    read.readAsText(fileRef.current.files[0]);
  };

  return (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-primary"
    >
      <ModalHeader toggle={toggleModal}>Importar Data</ModalHeader>
      <ModalBody>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              width: "45%",
              marginBottom: 25,
              minWidth: 345,
            }}
          >
            <div className="label-crudItem">
              <p>Tipo de Lista:</p>
            </div>
            <div className="input-group dropdown-infopedido">
              <div className="input-group-prepend">
                <label className="input-group-text">Tipo de Lista</label>
              </div>
              <select
                className="custom-select capitalize"
                //defaultValue={product ? product.type_list_id : null}
                //id="typePay"
                ref={listRef}
              >
                <option value="0">Choose...</option>
                {type_list.map((type_list, index) => (
                  <option
                    key={index}
                    value={type_list.id}
                    className="capitalize"
                  >
                    {type_list.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              width: "45%",
              marginBottom: 25,
              minWidth: 345,
            }}
          >
            <p style={{ marginBottom: 10 }}>Debe seleccionar un archivo .txt</p>
            <input ref={fileRef} type="file" accept=".txt" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Atrás
        </Button>

        <Button
          className="capitalize"
          color="primary"
          onClick={() => importProducts()}
        >
          Importar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UploadModal;
