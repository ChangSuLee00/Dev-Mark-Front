import axios, { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { FC } from "react";
import { ModalContext, UserContext } from "../../App";

// Interfaces

interface Delete {}

interface Patch {
  id: string;
  nick: string;
}

interface Get {
  Error: any;
  id: number;
  nick: string;
}

interface P {}

// React Start from here
const ProfilePage: FC<P> = (props: P): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  // Login Content
  const { loginContent } = useContext(UserContext);
  const { setLoginContent } = useContext(UserContext);
  const { setModalContent } = useContext(ModalContext);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Check Local Login
  const localUserLoggedin = localStorage.getItem("provider") === "local";
  console.log(loginContent);

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - Update User */
  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Password Check */
    if ((e.target as HTMLFormElement).Password.value == "") {
      // password가 비어있는 경우
      setModalContent({
        header: "Password ERROR",
        message: "enter password please",
        toggle: "view",
      });
      return;
    } else if (
      // password가 confirmpassword와 일치하지 않는 경우
      (e.target as HTMLFormElement).Password.value !==
      (e.target as HTMLFormElement).ConfirmPassword.value
    ) {
      setModalContent({
        header: "Password ERROR",
        message: "password do not match",
        toggle: "view",
      });
      return;
    }

    /* Nickname Check */
    if ((e.target as HTMLFormElement).Nickname.value == "") {
      // nickname이 없는 경우
      setModalContent({
        header: "Nickname ERROR",
        message: "enter your nickname please",
        toggle: "view",
      });
      return;
    }
    if ((e.target as HTMLFormElement).Nickname.value.length > 15) {
      // nickname의 길이가 15 이상인 경우
      setModalContent({
        header: "Nickname ERROR",
        message: "the maximum number of characters for a nickname is 15",
        toggle: "view",
      });
      return;
    }

    updateUser(e);

    window.location.replace("/");

    alert("please login again");
  };

  /* <Event Handler> - Delete User */
  const handleDeleteUser = () => {
    /* Delete Confirm */
    if (!window.confirm("Are you sure to delete?")) {
      return;
    }

    deleteUser();
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Axios Post /api/user/registration */
  const updateUser = async (e: any) => {
    try {
      await axios
        .patch<Patch>("/api/user/", {
          nick: e.target.Nickname.value,
          password: e.target.Password.value,
        })
        .then((res) => {
          window.localStorage.clear();

          setLoginContent({
            loggedIn: false,
            userId: "",
            userNick: "",
          });
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
          header: "User Info Modify ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };

  /* <Axios Request> - Axios Delete /api/user */
  const deleteUser = async () => {
    try {
      await axios.delete<Delete>("/api/user").then((res) => {
        // logout
        window.localStorage.clear();

        setLoginContent({
          loggedIn: false,
          userId: "",
          userNick: "",
        });

        // replace
        window.location.replace("/");
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
          header: "Sign Out ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };

  //--------------------------------------------------------
  // return

  return (
    <>
      {localUserLoggedin ? (
        <div className="login-wrapper mb-4">
          {/* Login Container */}
          <div className="login-container">
            {/* Header */}
            <h2 className="login-header">{loginContent.userNick}</h2>
            <form onSubmit={handleUpdateUser}>
              {/* Email Form */}
              <input
                type="text"
                className="form-control"
                id="Email"
                placeholder="Email"
                disabled
              />
              {/* Password Form */}
              <input
                type="text"
                className="form-control"
                id="Password"
                placeholder="Change Password"
              />
              {/* Password Form */}
              <input
                type="text"
                className="form-control"
                id="ConfirmPassword"
                placeholder="Confirm Password"
              />
              {/* Nickname Form */}
              <input
                type="nickname"
                className="form-control"
                id="Nickname"
                placeholder="Nickname"
              />
              {/* Login Button */}
              <button type="submit" className="login-button mt-2 mb-2">
                Modify
              </button>
            </form>

            {/* Delete Button */}
            <button
              type="submit"
              className="login-button mt-2 mb-4"
              onClick={handleDeleteUser}
            >
              Sign Out
            </button>

            {/* Divider */}
            <hr className="sidebar-divider my-0 mb-2" />
          </div>
        </div>
      ) : (
        <div className="login-wrapper mb-4">
          {/* Login Container */}
          <div className="login-container">
            {/* Header */}
            <h2 className="login-header">{loginContent.userNick}</h2>
            <form>
              {/* Email Form */}
              <input
                type="text"
                className="form-control"
                id="Email"
                placeholder="Email"
                disabled
              />
              {/* Password Form */}
              <input
                type="text"
                className="form-control"
                id="Password"
                placeholder="Change Password"
                disabled
              />
              {/* Password Form */}
              <input
                type="text"
                className="form-control"
                id="ConfirmPassword"
                placeholder="Confirm Password"
                disabled
              />
              {/* Nickname Form */}
              <input
                type="nickname"
                className="form-control"
                id="Nickname"
                placeholder="Nickname"
                disabled
              />
              {/* Login Button */}
              <button type="submit" className="login-button mt-2 mb-2">
                Oauth User Cannot Modify
              </button>
            </form>

            {/* Delete Button */}
            <button
              type="submit"
              className="login-button mt-2 mb-4"
              onClick={handleDeleteUser}
            >
              Sign Out
            </button>
            {/* Divider */}
            <hr className="sidebar-divider my-0 mb-2" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
function setModalContent(arg0: {
  header: string;
  message: string;
  toggle: string;
}) {
  throw new Error("Function not implemented.");
}
