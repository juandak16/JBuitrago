import React from "react";
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

const ConfirmationModal = (props) => {
  const { isOpenModal, toggleModal, color, word, wordtwo, confirm } = props;
  return (
    <Modal
      isOpen={isOpenModal}
      toggle={toggleModal}
      className={`modal-${color}`}
    >
      <ModalHeader toggle={toggleModal}>Confirmación</ModalHeader>
      <ModalBody>
        ¿Esta seguro que desea {word} el {wordtwo}?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Atrás
        </Button>

        <Button
          className="capitalize"
          color={color}
          onClick={() => confirm(word)}
        >
          {word}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
