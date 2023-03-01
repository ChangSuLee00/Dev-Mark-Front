import React from "react";
import { useParams } from "react-router-dom";
import FeedView from "../components/pages/FeedView";
import EditFeed from "../utils/edit/edit_feed";
import Scrollback from "../utils/scrollback";

const FeedPage = (): JSX.Element => {
  const { feed_id } = useParams<string>();

  return (
    <>
      {feed_id === "newfeed" ? <EditFeed /> : <FeedView />}
      <Scrollback />
    </>
  );
};

export default FeedPage;
