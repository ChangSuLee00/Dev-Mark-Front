import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import React, { FC, useContext, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios, { AxiosResponse } from "axios";
import { ModalContext } from "../../App";

// Interfaces
interface Post {
  Error: any;
  box: string;
  url: string;
}
interface P {
  type: string;
  category: string;
  bookmarkId: string;
  boxId: string;
}

// React Start from here
const EditAlarm: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...
  const { setModalContent } = useContext(ModalContext);

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - Alarm Create*/
  const handleCreateAlarm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(e.target as HTMLFormElement).Title.value) {
      // 알람 이름이 없는 경우
      setModalContent({
        header: "Alarm Name",
        message: "You must enter alarm name",
        toggle: "view",
      });
      return;
    }

    if (!startDate) {
      // 알람 날짜가 없는 경우
      setModalContent({
        header: "Alarm Name",
        message: "You must pick a date",
        toggle: "view",
      });
      return;
    }

    /* createAlarm Axios */
    createAlarm(e, startDate);

    /* Reload */
    window.location.replace("/alarms");
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Alarm Axios Post /api/alarm */
  const createAlarm = async (e: any, startDate: Date) => {
    try {
      await axios.post<Post>(process.env.REACT_APP_API_URL + "/api/alarm", {
        alarmName: e.target!.Title.value,
        time: startDate,
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
          header: "Edit ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };

  //--------------------------------------------------------
  // DataPicker

  /* DatePicker */
  const [startDate, setStartDate] = useState<Date>(
    setHours(setMinutes(new Date(), 30), 16)
  );

  /* DatePicker Change Handler */
  const handleDateChange = (date: Date) => {
    setStartDate(date);
  };

  //--------------------------------------------------------
  // return

  return (
    <>
      <form className="edit-form" onSubmit={handleCreateAlarm}>
        <input
          className="form-control"
          type="text"
          placeholder={`Category: #${props.category}`}
          aria-label="Disabled input example"
          disabled
        ></input>
        <input className="form-control" id="Title" placeholder="Title"></input>

        <DatePicker
          className="datapicker"
          selected={startDate}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          injectTimes={[
            setHours(setMinutes(new Date(), 1), 0),
            setHours(setMinutes(new Date(), 5), 12),
            setHours(setMinutes(new Date(), 59), 23),
          ]}
          dateFormat="MMMM d, yyyy h:mm aa"
          id="Date"
        />
        <button type="submit" className="login-button mt-2 mb-4">
          Edit
        </button>
      </form>
    </>
  );
};

export default EditAlarm;
