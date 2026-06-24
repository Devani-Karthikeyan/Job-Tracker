import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBell } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";

/* Map route paths to readable page titles */
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/jobs":      "My Jobs",
  "/add-job":   "Add Job",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();
  const dropdownRef      = useRef(null);
  const bellRef          = useRef(null);

  const [showProfile,  setShowProfile]  = useState(false);
  const [showBell,     setShowBell]     = useState(false);
  const [search,       setSearch]       = useState("");
  const [results,      setResults]      = useState([]);

  const { notifications = [], dismissNotification } = useJobs();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "";

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBell(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    navigate("/login");
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) { setResults([]); return; }

    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(
        `http://localhost:8080/api/jobs?keyword=${value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.content || []);
    } catch {
      /* silently ignore */
    }
  };

  const handleSelectJob = (job) => {
    setSearch("");
    setResults([]);
    navigate(`/edit-job/${job.id}`);
  };

  /* Generate avatar initials from user name */
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const notifCount = notifications.length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-6 gap-4">

      {/* PAGE TITLE */}
      <h1 className="text-xl font-bold text-slate-800 shrink-0 min-w-[120px]">
        {pageTitle}
      </h1>

      {/* SEARCH BAR — only when logged in */}
      {user && (
        <div className="relative flex-1 max-w-xl">
          <div className="flex items-center bg-gray-100 hover:bg-gray-200 transition rounded-xl px-4 py-2.5 gap-2">
            <FaSearch className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by company, role, location…"
              value={search}
              onChange={handleSearch}
              className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setResults([]); }}
                className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
              >
                ✕
              </button>
            )}
          </div>

          {/* DROPDOWN RESULTS */}
          {results.length > 0 && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 shadow-xl rounded-xl max-h-72 overflow-y-auto z-50">
              {results.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{job.jobTitle}</p>
                    <p className="text-xs text-gray-500 truncate">{job.companyName} {job.location ? `· ${job.location}` : ""}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 shrink-0 mt-0.5">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SPACER when not logged in */}
      {!user && <div className="flex-1" />}

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">

        {!user ? (
          <>
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-blue-600 hover:underline">Login</button>
            <button onClick={() => navigate("/register")} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Sign Up</button>
          </>
        ) : (
          <>
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setShowBell((p) => !p)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500"
                aria-label="Notifications"
              >
                <FaBell className="text-base" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showBell && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/70">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    {notifCount > 0 && (
                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {notifCount} active
                      </span>
                    )}
                  </div>

                  {/* Notification items */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                        <FaBell className="text-2xl opacity-30" />
                        <p className="text-xs font-semibold">No notifications right now</p>
                        <p className="text-[11px] text-gray-400">Reminders will appear here on the day</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition cursor-pointer ${n.type === "interview_alert" ? "bg-red-50/40" : ""}`}
                          onClick={() => {
                            setShowBell(false);
                            navigate(`/edit-job/${n.jobId}`);
                          }}
                        >
                          {/* Icon bubble */}
                          <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${n.type === "interview_alert" ? "bg-red-100" : "bg-blue-100"}`}>
                            {n.type === "interview_alert" ? "🚨" : n.message.startsWith("📅") ? "📅" : "🔔"}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold leading-snug ${n.type === "interview_alert" ? "text-red-700" : "text-slate-800"}`}>
                              {n.message}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{n.sub}</p>
                            {!n.dismissible && (
                              <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                                Persistent · Cannot dismiss
                              </span>
                            )}
                          </div>

                          {/* Dismiss button */}
                          {n.dismissible && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(n.id);
                              }}
                              className="shrink-0 text-gray-300 hover:text-gray-500 transition text-base leading-none mt-0.5"
                              title="Dismiss"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-center">
                    <p className="text-[11px] text-gray-400 font-medium">
                      {notifCount > 0 ? "Interview-day alerts cannot be dismissed" : "Set reminder dates on jobs to receive alerts here"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar / Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfile((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.name}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showProfile ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* PROFILE DROPDOWN */}
              {showProfile && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;