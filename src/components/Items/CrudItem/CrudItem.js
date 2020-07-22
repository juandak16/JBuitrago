import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { AppSwitch } from "@coreui/react";
import { GET_CRUD_PRODUCT } from "../../../constants/queries";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ConfirmationModal from "../../ConfirmationModal";
import UploadModal from "../../UploadModal";
import SelectSearch from "react-select-search";

export const INSERT_PRODUCTS = gql`
  mutation InsertProducts($objects: [product_insert_input!]!) {
    insert_product(
      objects: $objects
      on_conflict: {
        update_columns: [
          trademark
          description
          code
          price
          state
          type_list_id
          type_product
        ]
        constraint: product_id_key
      }
    ) {
      returning {
        id
      }
    }
  }
`;
export const INSERT_PRODUCT = gql`
  mutation InsertProduct(
    $code: String
    $trademark: String
    $description: String
    $type_list_id: Int
    $price: numeric
    $state: Boolean
    $id: Int
    $type_product: String
  ) {
    insert_product(
      objects: {
        code: $code
        description: $description
        price: $price
        trademark: $trademark
        type_list_id: $type_list_id
        state: $state
        id: $id
        type_product: $type_product
      }
    ) {
      returning {
        id
      }
    }
  }
`;
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $code: String
    $trademark: String
    $description: String
    $type_list_id: Int
    $price: numeric
    $id: Int
    $state: Boolean
    $type_product: String
  ) {
    update_product(
      where: { id: { _eq: $id } }
      _set: {
        code: $code
        description: $description
        price: $price
        trademark: $trademark
        type_list_id: $type_list_id
        state: $state
        type_product: $type_product
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const CrudItem = (props) => {
  const { isOpenModal, toggleModal, product, refetchProduct } = props;

  const { loading, error, data } = useQuery(GET_CRUD_PRODUCT(gql));

  const [state, setState] = useState("initial");
  const [insertProducts] = useMutation(INSERT_PRODUCTS);
  const [insertProduct] = useMutation(INSERT_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [listTypesProducts, setListTypesProducts] = useState([]);
  const [typeName, setTypeName] = useState(null);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const listRef = useRef(null);
  const descripcionRef = useRef(null);
  const codeRef = useRef(null);
  const trademarkRef = useRef(null);
  const priceRef = useRef(null);
  const idRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    if (data) getTypes();
  }, [data]);

  const getTypes = () => {
    console.log(type_product);
    //console.log(client);
    /*
      let obj = {
        id: 0,
        name: "",
      };
      client.unshift(obj);
    */
    type_product.map((item) => {
      item.value = item.name;
      return null;
    });
    setListTypesProducts(type_product);
  };

  const countChange = () => {
    if (priceRef.current.value < 0) {
      priceRef.current.value = 0;
    }
  };
  const toggleConfirmationModal = () => {
    setIsConfirmation(!isConfirmation);
  };
  const toggleUploadModal = () => {
    setIsUpload(!isUpload);
  };
  const checkedItem = () => {
    console.log(typeName);
    if (
      listRef.current.value !== "0" &&
      descripcionRef.current.value &&
      codeRef.current.value &&
      trademarkRef.current.value &&
      priceRef.current.value &&
      idRef.current.value &&
      typeName
    ) {
      toggleConfirmationModal();
    } else {
      alert("Debe completar todos los campos");
    }
  };

  const importListProducts = async (products, error) => {
    console.log(products);
    console.log(error);
    let str;
    error !== ""
      ? alert(
          `Se cargaron ${
            products.length
          } Productos, Los siguientes Productos no se pudieron cargar:
    ${error.map((item) => {
      console.log(item.id);
      str = "\n ID: " + item.id + " Código: " + item.code;
      return str;
    })}
      `
        )
      : alert(
          `Se cargaron ${products.length} Productos.
      `
        );

    toggleUploadModal();
    await insertProducts({ variables: { objects: products } });
    await refetchProduct();
    toggleModal();
  };

  const crudItem = async () => {
    setState("loading");
    toggleConfirmationModal();
    console.log();
    if (product) {
      await updateProduct({
        variables: {
          code: codeRef.current.value.toString(),
          trademark: trademarkRef.current.value.toString(),
          description: descripcionRef.current.value.toString(),
          type_list_id: listRef.current.value,
          price: priceRef.current.value,
          id: product.id,
          state: stateRef.current.state.checked,
          type_product: typeName,
        },
      });
    } else {
      await insertProduct({
        variables: {
          code: codeRef.current.value.toString(),
          trademark: trademarkRef.current.value.toString(),
          description: descripcionRef.current.value.toString(),
          type_list_id: listRef.current.value,
          price: priceRef.current.value,
          id: idRef.current.value,
          state: stateRef.current.state.checked,
          type_product: typeName,
        },
      });
    }

    await refetchProduct();
    toggleModal();
    setState("initial");
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { type_list, type_product } = data;
  return (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className="modal-lg modal-addItem"
    >
      <ModalHeader toggle={props.toggleModal}>
        <div>{product ? "Editar" : "Agregar"} Producto</div>
      </ModalHeader>
      <ModalBody className="modal-body-crudItem">
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Tipo de Lista:</p>
            </div>
            <div className="input-group dropdown-infopedido">
              <div className="input-group-prepend">
                <label className="input-group-text">Tipo de Lista</label>
              </div>
              <select
                className="custom-select capitalize"
                defaultValue={product ? product.type_list_id : null}
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

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Descripción:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={product ? product.description : null}
              ref={descripcionRef}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>
        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Código:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={product ? product.code : null}
              ref={codeRef}
              //onChange={() => countChange(count)}
            />
          </div>

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>ID:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={product ? product.id : null}
              ref={idRef}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>

        <div className="container-crudItem">
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Precio:</p>
            </div>
            <input
              //accessKey={index}
              type="number"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={product ? product.price : null}
              ref={priceRef}
              onChange={() => countChange()}
            />
          </div>

          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Marca:</p>
            </div>
            <input
              //accessKey={index}
              type="text"
              className="input-crudItem"
              aria-label="cantidad"
              aria-describedby="basic-addon1"
              defaultValue={product ? product.trademark : null}
              ref={trademarkRef}
              //onChange={() => countChange(count)}
            />
          </div>
        </div>

        <div className="container-crudItem">
          <div
            className="container-label-crudItem"
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <div className="label-crudItem" style={{ marginRight: 20 }}>
              <p style={{ marginBottom: 0 }}>Estado:</p>
            </div>
            {product ? (
              product.state ? (
                <AppSwitch
                  className={"mx-1"}
                  variant={"pill"}
                  color={"success"}
                  ref={stateRef}
                  label
                  checked
                />
              ) : (
                <AppSwitch
                  className={"mx-1"}
                  variant={"pill"}
                  color={"success"}
                  ref={stateRef}
                  label
                />
              )
            ) : (
              <AppSwitch
                className={"mx-1"}
                variant={"pill"}
                color={"success"}
                ref={stateRef}
                label
                checked
              />
            )}
          </div>
          <div className="container-label-crudItem">
            <div className="label-crudItem">
              <p>Tipo de Producto:</p>
            </div>
            <SelectSearch
              onChange={(value) => setTypeName(value)}
              value={product ? product.type_product : null}
              placeholder="Selecciona"
              options={listTypesProducts}
              search
              className="select-search"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="footer-crudItem">
        {product ? (
          <Button color="danger" onClick={toggleUploadModal}>
            Eliminar
          </Button>
        ) : (
          <Button color="primary" onClick={toggleUploadModal}>
            Importar
          </Button>
        )}

        <div className="buttons-action-crudItem">
          <Button color="secondary" onClick={toggleModal}>
            Atrás
          </Button>

          {product ? (
            <Button
              color="warning"
              onClick={() => checkedItem()}
              disabled={state === "loading"}
            >
              Editar
            </Button>
          ) : (
            <Button
              color="success"
              onClick={() => checkedItem()}
              disabled={state === "loading"}
            >
              Agregar
            </Button>
          )}
        </div>
      </ModalFooter>
      {
        // ¿Esta seguro que desea {word} el {wordtwo}?
        isConfirmation ? (
          <ConfirmationModal
            isOpenModal={isConfirmation}
            toggleModal={toggleConfirmationModal}
            color={"primary"}
            word={product ? "editar" : "crear"}
            wordtwo={"producto"}
            confirm={crudItem}
            state={state}
          />
        ) : null
      }
      {isUpload ? (
        <UploadModal
          isOpenModal={isUpload}
          toggleModal={toggleUploadModal}
          type_list={type_list}
          confirm={importListProducts}
          listTypesProducts={listTypesProducts}
        />
      ) : null}
    </Modal>
  );
};

export default CrudItem;
