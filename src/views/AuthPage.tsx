import React, { useState } from "react";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";

const AuthPage = (): JSX.Element => {
  const [loginPage, setPage] = useState<boolean>(true);

  const togglePage = () => {
    setPage((loginPage) => !loginPage);
  };

  function View() {
    if (loginPage === true) {
      return (
        <>
          <Login />
          {/* To register */}
          <div className="account-toggle" role="button" onClick={togglePage}>
            Create Account
          </div>
          <div className="mb-5" />
        </>
      );
    } else {
      return (
        <>
          <Register />
          {/* To login */}
          <div className="account-toggle" role="button" onClick={togglePage}>
            Already have an account
          </div>
          <div className="mb-5" />
        </>
      );
    }
  }

  return View();
};

export default AuthPage;
