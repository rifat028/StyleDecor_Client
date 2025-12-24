import React, { use } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import useRole from "../Hooks/useRole";
import Spinner from "../Components/Spinner";
import Forbidden from "../Components/ErrorPages/Forbidden";

const DecoratorRoutes = ({ children }) => {
  const { loading } = use(AuthContext);
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) return <Spinner></Spinner>;
  if (role !== "decorator") return <Forbidden></Forbidden>;
  return children;
};

export default DecoratorRoutes;
