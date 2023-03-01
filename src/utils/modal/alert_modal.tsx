import React, { FC, useContext } from "react";
import { ModalContext } from "../../App";

// Interfaces
interface P {
  header: string;
  message: string;
  toggle: any;
}

// React Start from here
const WModal: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  const { setModalContent } = useContext(ModalContext);

  //--------------------------------------------------------
  // return

  return (
    <div className="modal-container-background">
      <div className="modal-container">
        <div className="modal-head-container">
          <div className="modal-header">{props.header}</div>

          <button
            className="modal-button"
            onClick={() =>
              setModalContent({
                header: "",
                message: "",
                toggle: "",
              })
            }
          >
            X
          </button>
        </div>
        <hr className="sidebar-divider my-0 mt-3 mb-5" />
        <div className="modal-main">{props.message}</div>;
      </div>
    </div>
  );
};

export default WModal;
