import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

// Cache to prevent duplicate network requests when multiple components mount
const rolePromiseCache = {};

const useRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until auth state is resolved
    if (authLoading) return;

    // If no user is logged in, clear local cache and resolve immediately
    if (!user?.email) {
      localStorage.removeItem("styledecor_user_role");
      setRole(null);
      setLoading(false);
      return;
    }

    const email = user.email;

    // Check if we have a persisted role in localStorage to show immediately (Instant Load)
    const cachedRole = localStorage.getItem(`styledecor_user_role_${email}`);
    if (cachedRole) {
      setRole(cachedRole);
      setLoading(false);
    }

    // If we already have a pending or resolved promise for this email, reuse it
    if (rolePromiseCache[email]) {
      rolePromiseCache[email].then((fetchedRole) => {
        setRole(fetchedRole);
        setLoading(false);
      });
      return;
    }

    // Start a new fetch and store the promise in the cache
    if (!cachedRole) setLoading(true);
    
    const fetchPromise = axiosSecure.get(`/users/${email}`)
      .then((res) => {
        const fetchedRole = res.data?.role || "client";
        localStorage.setItem(`styledecor_user_role_${email}`, fetchedRole);
        return fetchedRole;
      })
      .catch((error) => {
        console.error("Failed to load user role:", error);
        return cachedRole || "client"; // fallback to cache or client
      });

    rolePromiseCache[email] = fetchPromise;

    fetchPromise.then((fetchedRole) => {
      setRole(fetchedRole);
      setLoading(false);
    });
  }, [user?.email, authLoading, axiosSecure]);

  return { role, roleLoading: loading };
};

export default useRole;
