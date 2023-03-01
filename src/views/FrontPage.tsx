import React, { useContext, useEffect } from "react";
import { UserContext } from "../App";
import Scrollback from "../utils/scrollback";

const FrontPage = (): JSX.Element => {
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
        <div className="front-page-text">
          <h1>
            Mark your Dev, <br /> Learn faster!
          </h1>
          <h4>
            <br />
            <br />
            Dev-Mark helps you organize your bookmarks
            <br />
            <br />
            And manage your dev-life
            <br />
            <br />
            Use feed to share your Dev experience!
          </h4>
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

export default FrontPage;
