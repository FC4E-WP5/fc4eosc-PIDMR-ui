import { Modal, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaCheck, FaCog } from "react-icons/fa";

interface StatusModalProps {
  itemId: string;
  itemName: string;
  status: string;
  show: boolean;
  onHide: () => void;
  onAction: () => void;
}
/**
 * Implements a simple component that displays a modal (popup window) when
 * the user needs to confirm the approval/disproval of an item. Modal accepts a list of
 * properties such as a title, message, itemId and itemName.
 * Also it accepts two callback functions: onHide (what to do when modal closes)
 * and onAction (what to do when user clicks Confirm button)
 */
export function StatusModal(props: StatusModalProps) {
  let mode = 0;
  if (props.status === "APPROVED") {
    mode = 1;
  }

  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={props.onHide}
    >
      <Modal.Header
        className={`${mode ? "bg-warning" : "bg-success"} text-white`}
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          {mode ? (
            <span>
              <FaCog className="me-2" />
              Change status to "Pending"
            </span>
          ) : (
            <span>
              <FaCheck className="me-2" />
              Change status to "Approved"
            </span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode ? (
          <span>
            Change item status from:{" "}
            <span className="badge bg-success">
              <FaCheck /> Approved
            </span>{" "}
            →{" "}
            <span className="badge bg-warning">
              <FaCog /> Pending
            </span>{" "}
            ?
          </span>
        ) : (
          <span>
            Change item status from:{" "}
            <span className="badge bg-warning">
              <FaCog /> Pending
            </span>{" "}
            →{" "}
            <span className="badge bg-success">
              <FaCheck /> Approved
            </span>{" "}
            ?
          </span>
        )}

        <ListGroup className="mt-2">
          <ListGroupItem>
            <strong>Name: </strong>
            {props.itemName}
          </ListGroupItem>
          <ListGroupItem>
            <strong>ID: </strong>
            {props.itemId}
          </ListGroupItem>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button
          className={`${mode ? "btn-warning" : "btn-success"} me-4`}
          onClick={props.onAction}
        >
          Confirm
        </Button>
        <Button className="btn-secondary" onClick={props.onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
