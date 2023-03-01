import axios, { AxiosResponse } from "axios";
import React, { FC, useContext } from "react";
import { ModalContext } from "../../App";

// Interfaces
interface Delete {
  Error: any;
  boxId: string;
}

interface P {
  header: string;
  message: string;
  toggle: any;
  url: string;
  id: string;
}

// React Start from here
const DModal: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...
  const { setModalContent } = useContext(ModalContext);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - Delete Box */
  const boxDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    /* Delete Box */
    deleteBox(props.url, props.id);

    /* Reload */
    window.location.reload();
  };

  /* <Event Handler> - Delete Bookmark */
  const bookmarkDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    /* Delete Box */
    deleteBookmark(props.id);

    /* Reload */
    window.location.reload();
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Box Axios Delete /api/box */
  const deleteBox = async (imgUrl: string, boxId: string) => {
    try {
      await axios.delete<Delete>(process.env.REACT_APP_API_URL + "/api/box", {
        data: {
          deleteImg: imgUrl,
          boxId: boxId,
        },
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
      if (error.response.data.Error) {
        setModalContent({
          header: "Edit ERROR",
          message: error.response.data.Error,
          toggle: "view",
        });
      }
    }
  };

  /* <Axios Request> - Bookmark Axios delete /api/bookmark */
  const deleteBookmark = async (bookmarkId: string) => {
    try {
      await axios.delete<Delete>(process.env.REACT_APP_API_URL + "/api/bookmark", {
        data: {
          id: bookmarkId,
        },
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
      if (error.response.data.Error) {
        setModalContent({
          header: "Edit ERROR",
          message: error.response.data.Error,
          toggle: "view",
        });
      }
    }
  };

  //--------------------------------------------------------
  // Render

  const DeleteButton = () => {
    if (props.header === "Delete_Box") {
      return <button onClick={boxDelete}>Yes</button>;
    }
    if (props.header === "Delete_Content") {
      return <button onClick={bookmarkDelete}>Yes</button>;
    }
  };

  //--------------------------------------------------------
  // return

  return (
    <>
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
          <div className="modal-main">
            Are you sure to delete? &nbsp;
            {DeleteButton()}
          </div>
          ;
        </div>
      </div>
    </>
  );
};

export default DModal;
