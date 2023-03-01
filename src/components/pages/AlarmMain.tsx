import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
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
  boxId: string;

  memoName: string;
  memoContent: string;
}

interface Delete {
  Error: any;
  memoId: string;
}

interface P {}

// React Start from here
const AlarmMain: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  /* Modal Context */
  const { setModalContent } = useContext(ModalContext);

  /* Memo State */
  const [alarms, setAlarms] = useState<any>([]);

  const alarmDelete = (e: any, alarmId: string) => {
    e.preventDefault();
    /* Delete Confirm */
    if (!window.confirm("Are you sure to delete?")) {
      return;
    }
    /* Delete Alarm */
    deleteAlarm(alarmId);
    /* Reload */
    window.location.replace("/alarms");
  };

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Alarm Axios Get /api/alarm -- Get All */
  const getAlarms = async () => {
    try {
      await axios.get<Get>(process.env.REACT_APP_API_URL + "/api/alarm").then((res) => {
        let newAlarm: Array<any[]> = [];
        for (let i = 0; i < res.data.length; i++) {
          const alarmName: string = res.data[i].alarmName;

          /* Date 포멧 형식 변환 */
          const time: Date = res.data[i].time;
          let date = new Date(time);
          date.toLocaleDateString();
          let newDate = date.toString();

          const alarmId = res.data[i].id;

          newAlarm.push([alarmName, newDate, alarmId]);
          // [boxName, boxUrl, boxId] 형태로 Array에 저장 후 setState
          setAlarms(newAlarm);
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

  /* <Axios Request> - Alarm Axios Delete /api/alarm */
  const deleteAlarm = async (alarmId: string) => {
    try {
      await axios.delete<Delete>(process.env.REACT_APP_API_URL + "/api/alarm", {
        data: {
          id: alarmId,
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
    const fetchAlarms = async () => {
      try {
        await getAlarms();
      } catch (e) {
        console.error(e);
      }
    };

    fetchAlarms();
  }, []);

  //--------------------------------------------------------
  // return

  return (
    <>
      {/* Header */}
      <Header header="Alarm" search={false} />
      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col">Check</th>
            <th scope="col">Name</th>
            <th scope="col">Alarm Time</th>
          </tr>
        </thead>

        {/* Main */}
        {alarms ? (
          <>
            {alarms.map((alarm: any[], index: number) => (
              <tbody key={index}>
                <tr>
                  <th scope="row">
                    <button
                      className="alarm-check"
                      onClick={(e: any) => {
                        alarmDelete(e, alarm[2]);
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </th>
                  <td>{alarm[0]}</td>
                  <td>{alarm[1]}</td>
                </tr>
              </tbody>
            ))}
          </>
        ) : null}
      </table>
    </>
  );
};

export default AlarmMain;
