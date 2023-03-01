import axios, { AxiosResponse } from "axios";
import React, { useContext, useRef } from "react";
import { ModalContext } from "../../App";

// Interfaces
interface Post {
  Error: any;
  email: string;
  password: string;
  json: object;
  token: string;
}

interface Get {
  Error: any;
  id: number;
  nick: string;
  Boxes: any;
  provider: string;
}

// React Start from here
const Login = (): JSX.Element => {
  //--------------------------------------------------------
  // Declaration of useState, useContext, useRef ...

  const { setModalContent } = useContext(ModalContext);
  const tokenRef = useRef("");

  //--------------------------------------------------------
  // Event Handler

  /* <Event Handler> - loginClickHandeler */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* Login */
    const errored = await login(e);
    /* Get Info */
    if (!errored) {
      await getInfo(e);
    }
  };

  //--------------------------------------------------------
  // Axios Request

  /* <Axios Request> - Login Axios Post /api/user/login */
  const login = async (e: any) => {
    try {
      await axios
        .post<Post>(process.env.REACT_APP_API_URL + "/api/user/login", {
          email: e.target.Email.value,
          password: e.target.Password.value,
        })
        .then((res) => {
          tokenRef.current = res.data.token;
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
          header: "Login ERROR",
          message: error.response.data.message,
          toggle: "view",
        });
      }
      return true;
      // 오류 난다면 errored = true 리턴
      // handleLogin 다음 동작을 방지한다
    }
  };

  /* <Axios Request> - Login Axios Get /api/info */
  const getInfo = async (e: any) => {
    try {
      await axios
        .get<Get>(process.env.REACT_APP_API_URL + "/api/user/info", {
          headers: { Authorization: `Bearer ${tokenRef.current}` },
        })
        .then((res) => {
          console.log(res);
          const UserId = String(res.data.id);
          const UserNick = String(res.data.nick);
          const Provider = String(res.data.provider);
          window.localStorage.setItem("userId", UserId);
          window.localStorage.setItem("userNick", UserNick);
          window.localStorage.setItem("provider", Provider);
          window.localStorage.setItem("token", tokenRef.current);

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
          header: "ERROR",
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
        <h2 className="login-header">Welcome!</h2>
        {/* Email Form */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="form-control"
            id="Email"
            placeholder="Email"
          />
          {/* Password Form */}
          <input
            type="password"
            className="form-control"
            id="Password"
            placeholder="Password"
          />
          {/* Remember Me */}
          <div className="form-check mb-3 remember-me">
            <input
              className="form-check-input remember-me-button"
              type="checkbox"
              value=""
              id="Remember"
            />
            <label className="form-check-label">Remember me</label>
          </div>
          {/* Login Button */}
          <button type="submit" className="login-button mt-2 mb-4">
            Login
          </button>
        </form>

        {/* Divider */}
        <hr className="sidebar-divider my-0 mb-4" />

        {/* OAuth1 */}
        <a href="http://localhost:5000/api/user/kakao">
          <button className="kakao-container mb-3">
            <img
              className="kakao-login"
              src={`https://github.com/ChangSuLee00/CS-study/blob/main/pictures/kakao_login.png?raw=true`}
            ></img>
          </button>
        </a>

        {/* OAuth2 */}
        <a href="http://localhost:5000/api/user/github">
          <button className="github-container mb-3">
            <img
              className="github-login"
              src={`https://github.com/ChangSuLee00/CS-study/blob/main/pictures/github_login.png?raw=true`}
            ></img>
          </button>
        </a>

        {/* Divider */}
        <hr className="sidebar-divider my-0 mb-2" />
      </div>
    </div>
  );
};

export default Login;
