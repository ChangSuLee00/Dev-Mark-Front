import React, { FC, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ModalContext, SidebarContext, UserContext } from "../../App";
import { Link } from "react-router-dom";
import axios, { AxiosResponse } from "axios";

// Interfaces
interface P {
  loggedIn: boolean;
  userNick: string;
}

interface Get {
  length: string;
}

interface Post {
  id: number;
}

// React Start from here
const NavBar: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  const { setSidebar } = useContext(SidebarContext);
  const { loginContent } = useContext(UserContext);
  const { setLoginContent } = useContext(UserContext);
  const { setModalContent } = useContext(ModalContext);

  const [notification, setNotification] = useState<string>();

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Alarm Axios Get /api/alarm/notification -- Get All */

  const nofityAlarm = async () => {
    try {
      await axios.get<Get>(process.env.REACT_APP_API_URL + "/api/alarm/notification").then((res) => {
        const alarms = res.data.length;
        setNotification(alarms);
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
        if (loginContent.loggedIn) {
          await nofityAlarm();
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchAlarms();
  }, [loginContent]);

  //--------------------------------------------------------
  // return

  return (
    // Navbar
    <nav className="navbar-content navbar navbar-expand navbar-light bg-white topbar mb-2 static-top shadow">
      {/* Slidebar Toggle */}
      <button
        type="button"
        className="btn sidebar-toggle"
        // onclickEvent Toggle
        onClick={() => setSidebar((prev: boolean) => !prev)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Topbar Navbar */}
      <ul className="navbar-nav navbar-left-container">
        {/* Notification */}
        <button className="nav-item position-relative notification">
          <Link to="/alarms" className="nav-notification">
            <FontAwesomeIcon icon={faBell} />
          </Link>
          {props.loggedIn && notification ? (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {`${notification}+`}
              <span className="visually-hidden">unread messages</span>
            </span>
          ) : null}
        </button>

        {/* BlockBar */}
        <div className="vr m-2"></div>

        {/* Dropdown UserName */}
        {props.loggedIn ? (
          <div className="dropstart btn-group username-content">
            <button
              type="button"
              className="btn data-toggle username-item"
              data-bs-toggle="dropdown"
              data-bs-display="static"
              aria-expanded="false"
            >
              <div className="username-nick">
                {loginContent.userNick} &nbsp;
              </div>
              <div>
                <FontAwesomeIcon icon={faUser} />
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
              <li>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.clear();
                    setLoginContent({
                      loggedIn: false,
                      userId: null,
                    });
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="btn-group username-content">
            <Link
              to="/auth"
              type="button"
              className="btn data-toggle username-item"
              data-bs-display="static"
              aria-expanded="false"
            >
              <div>
                <FontAwesomeIcon icon={faUser} />
              </div>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
