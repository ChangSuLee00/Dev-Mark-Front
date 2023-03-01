import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ModalContext } from "../../App";
import Header from "../common/Header";

// Interfaces
interface Get {
  Error: any;
  box: string;
  img: string;
  length: number;
  i: number;
  [index: number]: any;
}

// React Start from here
const Box = (): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  const { setModalContent } = useContext(ModalContext);
  const [boxs, setBoxs] = useState<string[][]>([]);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  /* Modals */

  const addBox = () => {
    setModalContent({
      header: "Edit_Box",
      toggle: "create",
    });
  };

  const updateBox = (url: string, id: string) => {
    setModalContent({
      header: "Modify_Box",
      toggle: "update",
      url: url,
      id: id,
    });
  };

  const deleteBox = (url: string, id: string) => {
    setModalContent({
      header: "Delete_Box",
      toggle: "delete",
      url: url,
      id: id,
    });
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Box Axios Get /api/box */
  const getBox = async () => {
    try {
      await axios.get<Get>(process.env.REACT_APP_API_URL + "/api/box").then((res) => {
        const newBox: Array<string[]> = [];
        for (let i = 0; i < res.data.length; i++) {
          const boxName: string = res.data[i].boxName;
          const boxUrl: string = res.data[i].img;
          const boxId: string = res.data[i].id;
          newBox.push([boxName, boxUrl, boxId]);
          // [boxName, boxUrl, boxId] 형태로 Array에 저장 후 setState
          setBoxs(newBox);
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
    const fetchBoxs = async () => {
      try {
        await getBox();
      } catch (e) {
        console.error(e);
      }
    };

    fetchBoxs();
  }, []);

  //--------------------------------------------------------
  // return

  return (
    <>
      {/* Header */}
      <Header header="Bookmark" search={true} />
      {/* Main */}
      {boxs ? (
        <div className="row row-cols-1 row-cols-md-4 g-4 mb-4 card-container">
          {boxs.map((box, index) => (
            // boxs 요소를 순회하며 렌더링
            <div className="col" key={index}>
              <div className="dropup add-card card h-100">
                <Link to={`/bookmarks/${box[2]}`}>
                  {box[1] === "" ? (
                    // 저장한 이미지가 없을 경우 default.png를 가져온다.
                    <img
                      src="https://raw.githubusercontent.com/ChangSuLee00/CS-study/main/pictures/default.png"
                      className="card-img-top"
                      alt="..."
                    />
                  ) : (
                    // 저장한 이미지가 있다면 가져온다.
                    <img src={box[1]} className="card-img-top" alt="..." />
                  )}
                </Link>

                <button
                  className="btn data-toggle card-body"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h5 className="card-title">#{box[0]}</h5>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        updateBox(box[1], box[2]);
                      }}
                    >
                      Modify
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => {
                        deleteBox(box[1], box[2]);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
          <div className="col">
            <div className="add-card card h-100" onClick={addBox}>
              <img
                src={`https://github.com/ChangSuLee00/CS-study/blob/main/pictures/add-item.png?raw=true`}
                className="card-img-add"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Add Box</h5>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-4 g-4 mb-4 card-container">
          <div className="col">
            <div className="add-card card h-100" onClick={addBox}>
              <img
                src={`${process.env.PUBLIC_URL}/images/add-item.png`}
                className="card-img-add"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Add Box</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Box;
