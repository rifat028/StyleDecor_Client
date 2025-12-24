import axios from "axios";
import React, { use, useEffect } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  // baseURL: "https://style-decor-server-woad.vercel.app",
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { user, logOutUser } = use(AuthContext);
  useEffect(() => {
    // request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(function (
      config
    ) {
      config.headers.Authorization = `Bearer ${user?.accessToken}`;
      return config;
    });

    // response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);
        const statusCode = error.status;
        if (statusCode === 401 || statusCode === 403) {
          //   logOutUser().then(() => {
          //     navigate("/login");
          //   });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOutUser, navigate]);
  return axiosSecure;
};

export default useAxiosSecure;
