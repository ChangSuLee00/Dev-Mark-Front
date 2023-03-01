import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
import Scrollback from "../utils/scrollback";

const AboutPage = (): JSX.Element => {
  const { loginContent } = useContext(UserContext);

  const viewport = () => {
    if (loginContent.loggedIn) {
      // 로그인 되어있다면 css를 container-logged-in으로 변경
      document
        .getElementById("frontpage-container")
        ?.classList.remove("container-not-logged-in");
      document
        .getElementById("frontpage-container")
        ?.classList.add("container-logged-in");
    } else {
      // 로그인 되어있지 않다면 css를 container-not-logged-in으로 변경
      document
        .getElementById("frontpage-container")
        ?.classList.remove("container-logged-in");
      document
        .getElementById("frontpage-container")
        ?.classList.add("container-not-logged-in");
    }
  };

  useEffect(() => {
    const fetchViews = async () => {
      try {
        await viewport();
      } catch (e) {
        console.error(e);
      }
    };

    fetchViews();
  }, []);

  return (
    <>
      {viewport()}
      <div id="frontpage-container" className="container-not-logged-in">
        <div className="front-page-text mt-1">
          <h2>
            <mark>Bookmark</mark>
          </h2>
          <h4>use Bookmark to organize your bookmarks</h4>

          <hr className="sidebar-divider my-0 mt-4 mb-4" />

          <h2>
            <mark>Alarm</mark>
          </h2>
          <h4>use Alarm to manage your day</h4>

          <hr className="sidebar-divider my-0 mt-4 mb-4" />

          <h2>
            <mark>Feed</mark>
          </h2>
          <h4>use Feed to share your experience</h4>

          <hr className="sidebar-divider my-0 mt-4 mb-4" />

          <h2>
            <mark>GPT</mark>
          </h2>
          <h4>use chatGPT to ask a question</h4>
        </div>
        <img
          className="background-img"
          src={`https://github.com/ChangSuLee00/CS-study/blob/main/pictures/default.png?raw=true`}
        ></img>
        <Scrollback />
      </div>
    </>
  );
};

export default AboutPage;
