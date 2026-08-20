import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "./useAxiosSecure";

// Resolves the logged-in decorator's agency ID: GET /decorators/me, falling back to /decorators/:email
// Shared across MyEarnings/MyProjects/MyAgents (and any future decorator-dashboard page) to remove the
// near-identical resolution logic previously copy-pasted in each of those files.
const useDecoratorId = (userEmail) => {
  const axiosSecure = useAxiosSecure();
  const [decoratorId, setDecoratorId] = useState(null);
  const [decoratorProfile, setDecoratorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const resolve = useCallback(async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      let dec = null;
      try {
        const res = await axiosSecure.get("/decorators/me");
        dec = res.data?.data || res.data;
      } catch {
        const res = await axiosSecure.get(`/decorators/${encodeURIComponent(userEmail)}`);
        dec = res.data?.data || res.data;
      }

      if (dec?._id) {
        setDecoratorId(dec._id);
        setDecoratorProfile(dec);
      }
    } catch (err) {
      console.error("Failed to resolve decorator agency profile:", err);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, userEmail]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  return { decoratorId, decoratorProfile, loading, refetch: resolve };
};

export default useDecoratorId;
