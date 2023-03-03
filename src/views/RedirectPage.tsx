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
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');

  const getInfo = async () => {
    try {
      await axios
        .get<Get>(process.env.REACT_APP_API_URL + "/api/user/info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const UserId = String(res.data.id);
          const UserNick = String(res.data.nick);
          const Provider = String(res.data.provider);
          window.localStorage.setItem("userId", UserId);
          window.localStorage.setItem("userNick", UserNick);
          window.localStorage.setItem("provider", Provider);
          window.localStorage.setItem("token", token!);

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
