import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

interface Get {
  Error: any;
  id: number;
  nick: string;
  provider: string;
}

const RedirectPage = (): JSX.Element => {
  const access_token = document.cookie
    ?.split("; ")
    ?.find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  const getInfo = async () => {
    try {
      await axios
        .get<Get>(process.env.REACT_APP_API_URL + "/api/user/info", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          const UserId = String(res.data.id);
          const UserNick = String(res.data.nick);
          const Provider = String(res.data.provider);
          window.localStorage.setItem("userId", UserId);
          window.localStorage.setItem("userNick", UserNick);
          window.localStorage.setItem("provider", Provider);
          window.localStorage.setItem("token", access_token!);

          document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          // 쿠키 삭제

          window.location.replace("/");
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          (error.response as AxiosResponse<{ message: string }>)?.data.message
        );
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getInfo();
  });

  return <div className="redirect"></div>;
};

export default RedirectPage;
