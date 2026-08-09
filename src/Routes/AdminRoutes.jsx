import React, { use } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import useRole from "../hooks/useRole";
import Spinner from "../features/home/components/Spinner";
import Forbidden from "../components/errors/Forbidden";

const AdminRoutes = ({ children }) => {
  const { loading } = use(AuthContext);
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) return <Spinner></Spinner>;
  if (role !== "admin") return <Forbidden></Forbidden>;
  return children;
};

export default AdminRoutes;
