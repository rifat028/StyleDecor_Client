import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

// Cache to prevent duplicate network requests when multiple components mount
const rolePromiseCache = {};

const useRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until auth state is resolved
    if (authLoading) return;

    // If no user is logged in, clear local cache and resolve immediately
    if (!user?.email) {
      localStorage.removeItem("styledecor_user_role");
      setRole(null);
      setDbUser(null);
      setLoading(false);
      return;
    }

    const email = user.email;

    // Check if we have a persisted role and user profile in localStorage to show immediately (Instant Load)
    const cachedRole = localStorage.getItem(`styledecor_user_role_${email}`);
    const cachedProfile = localStorage.getItem(`styledecor_user_profile_${email}`);
    if (cachedRole) {
      setRole(cachedRole);
      if (cachedProfile) {
        try {
          setDbUser(JSON.parse(cachedProfile));
        } catch (e) {
          // ignore parsing error
        }
      }
      setLoading(false);
    }

    const handleProfileUpdate = (e) => {
      if (e?.detail) {
        setDbUser(e.detail);
        if (e.detail.role) setRole(e.detail.role);
        rolePromiseCache[email] = Promise.resolve({
          role: e.detail.role || role,
          user: e.detail,
        });
      }
    };
    window.addEventListener("user-profile-updated", handleProfileUpdate);

    // If we already have a pending or resolved promise for this email, reuse it
    if (rolePromiseCache[email]) {
      rolePromiseCache[email].then((data) => {
        if (typeof data === "object" && data !== null) {
          setRole(data.role);
          if (data.user) setDbUser(data.user);
        } else {
          setRole(data);
        }
        setLoading(false);
      });
      return () => {
        window.removeEventListener("user-profile-updated", handleProfileUpdate);
      };
    }

    // Start a new fetch and store the promise in the cache
    if (!cachedRole) setLoading(true);
    
    const fetchPromise = axiosSecure.get("/users/me")
      .then((res) => {
        const fetchedUser = res.data?.data || res.data;
        const fetchedRole = fetchedUser?.role || "customer";
        localStorage.setItem(`styledecor_user_role_${email}`, fetchedRole);
        if (fetchedUser) {
          localStorage.setItem(`styledecor_user_profile_${email}`, JSON.stringify(fetchedUser));
        }
        return { role: fetchedRole, user: fetchedUser };
      })
      .catch((error) => {
        console.error("Failed to load user profile & role:", error);
        return { role: cachedRole || "customer", user: null }; // fallback to cache or customer
      });

    rolePromiseCache[email] = fetchPromise;

    fetchPromise.then(({ role: fetchedRole, user: fetchedUser }) => {
      setRole(fetchedRole);
      if (fetchedUser) setDbUser(fetchedUser);
      setLoading(false);
    });

    return () => {
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
    };
  }, [user?.email, authLoading, axiosSecure]);

  return { role, roleLoading: loading, dbUser };
};

export default useRole;
