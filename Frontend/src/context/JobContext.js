import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axiosConfig";

/* ─────────────────────────────────────────
   JobContext
   ─────────────────────────────────────────
   Provides a single source of truth for all
   job data across the app.

   • Automatically fetches jobs whenever a
     valid JWT token is present in localStorage.
   • Exposes refreshJobs() so any component
     can force a fresh fetch without a page reload.
   • The Jobs page also uses local filter/pagination
     state, but can call refreshJobs() after mutations.
───────────────────────────────────────── */

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const refreshJobs = useCallback(async () => {
    // Only fetch if the user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      setAllJobs([]);
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      // Fetch ALL jobs (large page size) for dashboard stats
      const res = await api.get("/jobs", { params: { page: 0, size: 1000 } });
      setAllJobs(res.data.content || []);
    } catch (err) {
      console.error("JobContext: failed to fetch jobs", err);
      setAllJobs([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Auto-fetch on mount (covers the case where the user is already logged in
  // and just navigates between pages — no page reload needed).
  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  return (
    <JobContext.Provider value={{ allJobs, loading, initialized, refreshJobs }}>
      {children}
    </JobContext.Provider>
  );
};

// Convenience hook
export const useJobs = () => {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobs must be used inside <JobProvider>");
  return ctx;
};
