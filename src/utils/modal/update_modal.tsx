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
  toggle: any;
  url: string;
  id: string;
}

interface Patch {
  Error: any;
  box: string;
  url: string;
  id: string;
  d_url: string;
  bookmarkName: string;
  bookmarkURL: string;
}

// React Start from here
const UModal: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  const { setModalContent } = useContext(ModalContext);
  const [file, setFile] = useState<File>();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - Box Update*/
  const BoxUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    if (file !== undefined) {
      await uploadImg(e, formData, config);
      await updateBox(e, imageURL, props.id, props.url);
    } else {
      await updateBox(e, props.url, props.id, "");
    }

    /* Reload */
    window.location.reload();
  };

  /* <Event Handler> - Content Update */
  const ContentUpdate = async (e: any) => {
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
    e.preventDefault();

    await updateContent(e, props.id);

    /* Reload */
    window.location.reload();
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Image Axios Post /api/box/img */
  let imageURL = "";
  const uploadImg = async (e: any, formData: FormData, config: object) => {
    try {
      await axios.post<Post>(process.env.REACT_APP_API_URL + "/api/box/img", formData, config).then((res) => {
        imageURL = res.data.url;
        if (res.data.Error) {
          setModalContent({
            header: "Edit ERROR",
            message: res.data.Error,
            toggle: "view",
          });
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
    }
  };

  /* <Axios Request> - Box Axios Patch /api/box */
  const updateBox = async (
    e: any,
    imgURL: string,
    boxId: string,
    deleteImgUrl: string
  ) => {
    try {
      await axios.patch<Patch>(process.env.REACT_APP_API_URL + "/api/box", {
        boxName: e.target.Box.value,
        img: imgURL,
        boxId: boxId,
        deleteImg: deleteImgUrl,
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

  /* <Axios Request> - Bookmark Axios Patch /api/bookmark */
  const updateContent = async (e: any, contentId: string) => {
    try {
      await axios.patch<Patch>(process.env.REACT_APP_API_URL + "/api/bookmark", {
        bookmarkName: e.target.BookmarkName.value,
        URL: e.target.BookmarkURL.value,
        bookmarkId: contentId,
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
  /* Handle ect */

  /* Image File Change Handler*/
  const fileChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const files = (target.files as FileList)[0];
    setFile(files);
  };

  //--------------------------------------------------------
  // Render

  /* Handle Main Content */
  const modalMain = () => {
    if (props.header === "Modify_Box") {
      return (
        <form className="edit-box" onSubmit={BoxUpdate}>
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
            Modify
          </button>
        </form>
      );
    } else if (props.header === "Update_Content") {
      return (
        <form className="edit-box" onSubmit={ContentUpdate}>
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

export default UModal;
