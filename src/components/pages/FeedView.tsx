import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ModalContext, UserContext } from "../../App";
import Header from "../common/Header";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Interfaces
interface Get {
  Error: any;
  box: string;
  img: string;
  length: number;
  i: number;
  [index: number]: any;
}

interface Delete {
  Error: any;
  feedId: string;
}

interface P {}

// React Start from here
const FeedView: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...
  const [searchParams, setSearchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const search = searchParams.get("search");
  const [writeSearch, setWriteSearch] = useState("");

  const { loginContent } = useContext(UserContext);
  const { setModalContent } = useContext(ModalContext);
  const [feeds, setFeeds] = useState<string[][]>([]);
  
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - handleOpenFeed */
  const handleDeleteFeed = (e: string) => {
    /* Delete Confirm */
    if (!window.confirm("Are you sure to delete?")) {
      return;
    }
    /* Delete Feed */
    deleteFeed(e);
    /* Reload */
    window.location.replace("/feeds?id=0");
    window.location.reload();
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Feed Axios Get /api/feed */
  const getFeed = async () => {
    try {
      await axios
        .get<Get>(process.env.REACT_APP_API_URL + `/api/feed?id=${id}&search=${search}`)
        .then((res) => {
          const newFeed: Array<string[]> = [];
          for (let i = 0; i < res.data.length; i++) {
            const feedName: string = res.data[i].FeedName;
            const feedContent: string = res.data[i].FeedContent;
            const feedUrl: string = res.data[i].URL;
            const feedImg: string = res.data[i].img;
            const feedId: string = res.data[i].id;
            const feedUserId: string = res.data[i].user.id;
            newFeed.push([
              feedName,
              feedContent,
              feedUrl,
              feedImg,
              feedId,
              feedUserId,
            ]);
            setFeeds(newFeed);
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

  /* <Axios Request> - Feed Axios Delete /api/feed */
  const deleteFeed = async (feedId: string) => {
    try {
      await axios.delete<Delete>(process.env.REACT_APP_API_URL + "/api/feed", {
        data: {
          id: feedId,
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
    const fetchFeed = async () => {
      try {
        await getFeed();
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeed();
  }, []);

  //--------------------------------------------------------
  // return
  return (
    <>
      {/* Header */}
      <Header header="Feed" search={false} />
      {/* Main */}
      <div className="edit-feed-container">
        <Link to="/feeds/newfeed">
          <button type="button" className="btn btn-secondary feed-edit">
            Edit
          </button>
        </Link>

        <div className="feed-input-group">
          <input
            type="search"
            className="form-control rounded feed-search-form"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
            value={writeSearch}
            onChange={(e) => setWriteSearch(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-primary feed-search-btn"
          >
            <a href={`/feeds?id=${id}&search=${writeSearch}`}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </a>
          </button>
        </div>
      </div>

      {/* Cards */}
      {feeds ? (
        <>
          {feeds.map((feed, index) => (
            <div className="card mb-3 card-wrapper" key={index}>
              <div className="feed-row row g-0">
                <div className="feed-col col-md-4">
                  <img
                    src={`${feed[3]}`}
                    className="img-fluid rounded-start feed-img"
                    alt="..."
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="card-text">
                      <a className="hyper-link" href={feed[2]} target="_blank">
                        <h4>{feed[0]}</h4>
                        {feed[1]}
                      </a>
                      {feed[5] == loginContent.userId ? (
                        <button
                          className="delete-feed"
                          onClick={() => {
                            handleDeleteFeed(feed[4]);
                          }}
                        >
                          X
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : null}
        <div className="page_nav mt-5 mb-5">
          <button className="page-item">
            {id === 0 ? (
              <a
                href={`/feeds?id=${id}&search=${search}`}
                className="page-link"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            ) : (
              <a
                href={`/feeds?id=${id - 1}&search=${search}`}
                className="page-link"
                aria-label="Previous"
              >
                <span>&laquo;</span>
              </a>
            )}
          </button>
          <button className="page-item">
            <div className="page-link">&nbsp; &nbsp;</div>
          </button>
          <button className="page-item">
            <a
              href={`/feeds?id=${id + 1}&search=${search}`}
              className="page-link"
            >
              <span>&raquo;</span>
            </a>
          </button>
        </div>
    </>
  );
};

export default FeedView;
