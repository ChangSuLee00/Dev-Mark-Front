import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AlarmMain from "../components/pages/AlarmMain";
import EditAlarm from "../utils/edit/edit_alarm";
import Scrollback from "../utils/scrollback";

const AlarmPage = (): JSX.Element => {
  /* Get Memo_id */
  const { alarm_id } = useParams<string>();
  /* 쿼리스트링 해석 */
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const boxId = searchParams.get("box");
  const bookmarkId = searchParams.get("bookmarkId");

  /* Render Page or EditMemo */
  const alarmPageRender = () => {
    if (alarm_id === "newalarm" && category && boxId && bookmarkId) {
      return (
        <>
          <EditAlarm
            type={alarm_id}
            category={category}
            boxId={boxId}
            bookmarkId={bookmarkId}
          />
        </>
      );
    } else {
      return <>{<AlarmMain />}</>;
    }
  };

  return (
    <>
      {alarmPageRender()}
      <Scrollback/>
    </>
  );
};

export default AlarmPage;
