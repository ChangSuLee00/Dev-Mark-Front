import axios, { AxiosResponse } from "axios";
import React, { FC, useContext, useState } from "react";
import { ModalContext } from "../../App";

// Interfaces
interface Post {
  Error: any;
  file: any;
  box: string;
  url: string;
}

interface P {
  header: string;
  message: string;
  toggle: any;
  id: string;
}

// React Start from here
const CModal: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...
  const { setModalContent } = useContext(ModalContext);
  const [file, setFile] = useState<File>();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - Bookmark Create */
  const BookmarkCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Bookmark Name Check */
    if (!(e.target as HTMLFormElement).BookmarkName.value) {
      // 북마크 이름이 없는 경우
      setModalContent({
        header: "Bookmark Name",
        message: "You must enter bookmark name",
        toggle: "view",
      });
      return;
    }
    if ((e.target as HTMLFormElement).BookmarkName.value.length > 15) {
      // 북마크 이름이 15글자 이상인 경우
      setModalContent({
        header: "Bookmark Name",
        message: "the maximum number of characters for a bookmark is 15",
        toggle: "view",
      });
      return;
    }

    /* Bookmark URL Check */
    if (!(e.target as HTMLFormElement).BookmarkURL.value) {
      // 북마크 url이 없는 경우
      setModalContent({
        header: "Bookmark URL",
        message: "You must enter bookmark URL",
        toggle: "view",
      });
      return;
    }

    /* Create Bookmark */
    createBookmark(e, props.id);

    /* Reload */
    window.location.reload();
  };

  /* <Event Handler> - Box Edit */
  const BoxCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((e.target as HTMLFormElement).Box.value.length > 15) {
      setModalContent({
        header: "Box Name",
        message: "the maximum number of characters for a bookmark box is 15",
        toggle: "view",
      });
      return;
    }

    /* FormData */
    const formData = new FormData();
    if (file !== undefined) {
      formData.append("img", file);
    }
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    /* Image Upload */
    await uploadImg(e, formData, config);

    /* Create Box */
    await createBox(e, imageURL);

    /* Reload */
    window.location.reload();
  };

  /* <Event Handler> - Handle Image File */
  const fileChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const files = (target.files as FileList)[0];
    setFile(files);
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Bookmark Axios Post /api/content*/
  const createBookmark = async (
    e: React.FormEvent<HTMLFormElement>,
    BoxId: string
  ) => {
    try {
      await axios.post<Post>(process.env.REACT_APP_API_URL + "/api/bookmark", {
        bookmarkName: (e.target as HTMLFormElement).BookmarkName.value,
        URL: (e.target as HTMLFormElement).BookmarkURL.value,
        boxId: BoxId,
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

  /* <Axios Request> - Image Axios Post /api/box/img */
  let imageURL = "";
  const uploadImg = async (e: any, formData: FormData, config: object) => {
    try {
      await axios.post<Post>(process.env.REACT_APP_API_URL + "/api/box/img", formData, config).then((res) => {
        imageURL = res.data.url;
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
          header: "ERROR",
          message: error.response.data.Error,
          toggle: "view",
        });
      }
    }
  };

  /* <Axios Request> - Box Axios Post /api/box */
  const createBox = async (e: any, imgURL: string) => {
    try {
      await axios.post<Post>(process.env.REACT_APP_API_URL + 
        "/api/box/",
        {
          boxName: e.target.Box.value,
          img: imgURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  // -------------------------------------------------------------------------
  // Render

  /* Render Main Content */
  const modalMain = () => {
    if (props.header === "Edit_Box") {
      return (
        <form className="edit-box" onSubmit={BoxCreate}>
          <input
            type="file"
            className="img-upload mb-3"
            accept="image/*"
            onChange={fileChangedHandler}
          ></input>
          <input
            type="text"
            className="form-control"
            id="Box"
            placeholder="Box Name"
          />
          <button type="submit" className="login-button">
            Edit
          </button>
        </form>
      );
    } else if (props.header === "Edit_Bookmark") {
      return (
        <form className="edit-box" onSubmit={BookmarkCreate}>
          <input
            type="text"
            className="form-control"
            id="BookmarkName"
            placeholder="Bookmark Name"
          />
          <input
            type="text"
            className="form-control"
            id="BookmarkURL"
            placeholder="URL"
          />
          <button type="submit" className="login-button">
            Edit
          </button>
        </form>
      );
    }
  };

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
        {modalMain()}
      </div>
    </div>
  );
};

export default CModal;
