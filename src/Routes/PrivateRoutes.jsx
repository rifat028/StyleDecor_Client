import React, { use } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import { Navigate, useLocation } from "react-router";
import Spinner from "../Components/Spinner";

const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const { user, loading } = use(AuthContext);
  if (loading) return <Spinner></Spinner>;
  if (user) return children;
  return <Navigate state={location?.pathname} to="/login"></Navigate>;
};

export default PrivateRoutes;
