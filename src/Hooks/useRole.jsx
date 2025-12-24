import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // wait until auth is ready
    if (authLoading || !user?.email) return;

    const loadRole = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/users/${user.email}`);
        setRole(res.data?.role || "client");
      } catch (error) {
        console.error("Failed to load user role:", error);
        setRole("client"); // safe fallback
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, [user?.email, authLoading, axiosSecure]);

  return { role, roleLoading: loading };
};

export default useRole;
