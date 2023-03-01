import React from "react";
import GptMain from "../components/pages/Gpt";
import Scrollback from "../utils/scrollback";

const GptPage = (): JSX.Element => {
  return (
    <>
      <GptMain memoId="" />
      <Scrollback/>
    </>
  );
};

export default GptPage;
