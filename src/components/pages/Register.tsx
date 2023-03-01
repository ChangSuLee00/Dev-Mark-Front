import axios, { AxiosResponse } from "axios";
import React, { useContext } from "react";
import { ModalContext } from "../../App";

// Interfaces
interface Post {
  Error: any;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  success: boolean;
}

/* Email Check Reg*/
function email_check(email: string) {
  var reg =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return reg.test(email);
}

// React Start from here
const Register = (): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  /* Modal View Toggle */
  const { setModalContent } = useContext(ModalContext);

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - Register Scripts */
  const handelRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Email Check */
    if (!email_check((e.target as HTMLFormElement).Email.value)) {
      // e.target이 속성 값을 갖는 것이 보장되어 있지 않다.
      // 따라서 value 속성이 있는 HTMLFormElement인지 확인하기 위해 적절하게 타이핑.
      setModalContent({
        header: "Email ERROR",
        message: "check your email again",
        toggle: "view",
      });
      return;
    }

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

    /* register */
    register(e);
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Register Axios Post /api/user/registration */
  const register = async (e: any) => {
    try {
      await axios
        .post<Post>(process.env.REACT_APP_API_URL + "/api/user/registration", {
          email: e.target.Email.value,
          nick: e.target.Nickname.value,
          password: e.target.Password.value,
        })
        .then((res) => {
          if (res.data.success) {
            window.location.replace("/auth");
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
          header: "Register ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
    }
  };

  //--------------------------------------------------------
  // return

  return (
    <div className="login-wrapper mb-4">
      {/* Login Container */}
      <div className="login-container">
        {/* Header */}
        <h2 className="login-header">Register</h2>
        <form onSubmit={handelRegister}>
          {/* Email Form */}
          <input
            type="text"
            className="form-control"
            id="Email"
            placeholder="Email"
          />
          {/* Password Form */}
          <input
            type="text"
            className="form-control"
            id="Password"
            placeholder="Password"
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
          <button type="submit" className="login-button mt-2 mb-4">
            Register
          </button>
        </form>

        {/* Divider */}
        <hr className="sidebar-divider my-0 mb-2" />
      </div>
    </div>
  );
};

export default Register;
