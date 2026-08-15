import React, { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import useRole from "../hooks/useRole";
import Spinner from "../features/home/components/Spinner";
import Forbidden from "../components/errors/Forbidden";

const AgentRoutes = ({ children }) => {
  const { loading } = useContext(AuthContext);
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) return <Spinner />;
  if (role !== "agent") return <Forbidden />;
  return children;
};

export default AgentRoutes;
