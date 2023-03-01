import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import ProfilePage from "../components/pages/Profile";
import Scrollback from "../utils/scrollback";

const FeedPage = (): JSX.Element => {
  const { user_id } = useParams<string>();
  const { loginContent } = useContext(UserContext);

  return (
    <>
      {loginContent.loggedIn ? <ProfilePage /> : null}
      <Scrollback />
    </>
  );
};

export default FeedPage;
