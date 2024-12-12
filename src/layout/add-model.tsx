import type { ChildrenProps } from "../types/props";
import {
  type ElementRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import Modal from "react-bootstrap/Modal";

type Props = {
  title: string;
  action: JSX.Element;
  dialog?: boolean;
} & ChildrenProps;

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef<ElementRef<typeof Modal>, Props>(
  ({ children, title, action }, ref) => {
    const [show, setShow] = useState(false);

    const onShow = useCallback(() => setShow(true), []);
    const onClose = useCallback(() => setShow(false), []);

    useImperativeHandle(ref, () => {
      return {
        show: onShow,
        close: onClose,
      };
    }, [onClose, onShow]);

    return (
      <Modal ref={ref} show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>{action}</Modal.Footer>
      </Modal>
    );
  }
);
