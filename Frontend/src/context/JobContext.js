import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
   • Computes live notifications from job data:
     - "reminder" type: fires on reminderDate (dismissible via localStorage)
     - "interview_alert" type: fires on interviewDate day itself (persistent)
   • Pre-interview alerts fire 1 day before the interview date (dismissible)
───────────────────────────────────────── */

const JobContext = createContext(null);

const DISMISSED_KEY = "jt_dismissed_notifications";

const getDismissedIds = () => {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveDismissedIds = (ids) => {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
};

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const JobProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(getDismissedIds);

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

  // Auto-fetch on mount
  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  // Compute live notification list from jobs
  const notifications = useMemo(() => {
    const today = todayStr();
    const result = [];

    allJobs.forEach((job) => {
      // ── Interview-day alert (persistent, non-dismissible) ──
      if (job.interviewDate && job.interviewDate === today) {
        result.push({
          id: `int-${job.id}`,
          type: "interview_alert",
          dismissible: false,
          jobId: job.id,
          message: `🚨 Interview TODAY – ${job.jobTitle} at ${job.companyName}`,
          sub: "Your interview is happening today. Good luck!",
        });
      } else {
        // ── Reminder-date alert (dismissible) ──
        if (job.reminderDate && job.reminderDate === today) {
          const notifId = `rem-${job.id}`;
          if (!dismissedIds.includes(notifId)) {
            result.push({
              id: notifId,
              type: "reminder",
              dismissible: true,
              jobId: job.id,
              message: `🔔 Reminder – ${job.jobTitle} at ${job.companyName}`,
              sub: job.interviewDate
                ? `Interview scheduled on ${job.interviewDate}`
                : "Interview date not yet set.",
            });
          }
        }
        // ── Pre-interview reminder: 1 day before interview ──
        if (job.interviewDate) {
          const [iy, im, id_] = job.interviewDate.split("-").map(Number);
          const iDate = new Date(iy, im - 1, id_);
          const nowDate = new Date();
          nowDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((iDate - nowDate) / 86400000);
          if (diffDays === 1) {
            const notifId = `pre-${job.id}`;
            if (!dismissedIds.includes(notifId)) {
              result.push({
                id: notifId,
                type: "reminder",
                dismissible: true,
                jobId: job.id,
                message: `📅 Interview TOMORROW – ${job.jobTitle} at ${job.companyName}`,
                sub: `Scheduled for ${job.interviewDate}. Time to prepare!`,
              });
            }
          }
        }
      }
    });

    return result;
  }, [allJobs, dismissedIds]);

  const dismissNotification = useCallback((id) => {
    setDismissedIds((prev) => {
      const next = [...prev, id];
      saveDismissedIds(next);
      return next;
    });
  }, []);

  return (
    <JobContext.Provider value={{ allJobs, loading, initialized, refreshJobs, notifications, dismissNotification }}>
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
