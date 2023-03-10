import axios, { AxiosResponse } from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "../../App";
import { Link } from "react-router-dom";
import Header from "../common/Header";

// Interfaces
interface Get {
  Error: any;
  box: string;
  img: string;
  length: number;
  i: number;
  [index: number]: any;
  boxId: string;
}

interface P {
  boxId: string;
}

// React Start from here
const BoxContent: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  const { setModalContent } = useContext(ModalContext);
  const [bookmarks, setBoookmarks] = useState<any[][]>([]);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Modals

  /* Add Bookmark */
  const addBookmark = () => {
    setModalContent({
      header: "Edit_Bookmark",
      toggle: "create",
      id: props.boxId,
    });
  };

  /* Delete Content */
  const deleteContent = (id: string) => {
    setModalContent({
      header: "Delete_Content",
      toggle: "delete",
      id: id,
      boxId: props.boxId,
    });
  };

  /* Update Content */
  const updateContent = (bookmarkId: string) => {
    setModalContent({
      header: "Update_Content",
      toggle: "update",
      id: bookmarkId,
      boxId: props.boxId,
    });
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Memo Axios Get /api/content */
  const getBookmark = async () => {
    try {
      await axios
        .get<Get>(
          process.env.REACT_APP_API_URL + `/api/bookmark?boxId=${props.boxId}`
        )
        .then((res) => {
          const newBookmark: Array<any[]> = [];
          /*
           * [bookmarkName, encodedName, bookmarkURL, bookmarkId, [memoId, memoName]
           * ????????? ???????????? state??? ????????????.
           */
          for (let i = 0; i < res.data.length; i++) {
            const bookmarkName: string = res.data[i].bookmarkName;
            const encodedName: string = encodeURIComponent(bookmarkName);
            const bookmarkURL: string = res.data[i].URL;
            const bookmarkId: string = res.data[i].id;

            newBookmark.push([
              bookmarkName,
              encodedName,
              bookmarkURL,
              bookmarkId,
            ]);
            setBoookmarks(newBookmark);
          }
        });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
      if (error.response.data.message) {
        setModalContent({
          header: "ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };

  //--------------------------------------------------------
  /* Fetching Data */

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        await getBookmark();
      } catch (e) {
        console.error(e);
      }
    };
    fetchBookmark();
  }, []);

  //--------------------------------------------------------
  // return

  return (
    <>
      {/* Header */}
      <Header header="Bookmark" search={false} />

      {/* Content */}
      {bookmarks ? (
        // bookmaks??? ?????????
        <>
          {bookmarks.map((bookmark, index) => (
            // bookmarks??? ???????????? ??????
            <div className="card bookmark-card" key={index}>
              <div className="bookmark-card-header">
                <div className="bookmark-card-header-left">
                  <a
                    href={bookmark[2]}
                    target="_blank"
                    className="bookmark-name-container"
                  >
                    {/* ????????? ????????? ?????? */}
                    <button className="bookmark-menu">{bookmark[0]}</button>
                    {/* ????????? ?????? */}
                  </a>
                </div>

                <div className="bookmark-card-header-right">
                  <button className="bookmark-menu">
                    <Link
                      to={`/alarms/newalarm?category=${bookmark[1]}&box=${props.boxId}&bookmarkId=${bookmark[3]}`}
                      className="dropdown-item"
                      // ????????? ????????????????????? ????????? ????????? newalarm?????? ??????
                    >
                      <FontAwesomeIcon icon={faClock} />
                    </Link>
                  </button>
                  <button className="bookmark-menu">
                    <FontAwesomeIcon
                      icon={faWrench}
                      // Modify
                      onClick={() => {
                        updateContent(bookmark[3]);
                      }}
                    />
                  </button>
                  <button className="bookmark-menu">
                    <FontAwesomeIcon
                      icon={faBan}
                      // Delete
                      onClick={() => {
                        deleteContent(bookmark[3]);
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* New */}
          <div className="card bookmark-card">
            <div className="bookmark-card-header">
              <div className="bookmark-card-header-left">
                <button className="bookmark-menu" onClick={addBookmark}>
                  New
                </button>
              </div>

              <div className="bookmark-card-header-right">
                <div className="bookmark-placeholder" />
              </div>
            </div>
          </div>
        </>
      ) : (
        //  New
        <div className="card bookmark-card">
          <div className="bookmark-card-header">
            <div className="bookmark-card-header-left">
              <button className="bookmark-menu" onClick={addBookmark}>
                New
              </button>
            </div>

            <div className="bookmark-card-header-right">
              <div className="bookmark-placeholder" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoxContent;
