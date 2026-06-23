import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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

  const [showProfile, setShowProfile] = useState(false);
  const [search,      setSearch]      = useState("");
  const [results,     setResults]     = useState([]);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "";

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
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
      <div className="flex items-center gap-3 shrink-0 ml-auto" ref={dropdownRef}>

        {!user ? (
          /* Public links */
          <>
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-blue-600 hover:underline">Login</button>
            <button onClick={() => navigate("/register")} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Sign Up</button>
          </>
        ) : (
          /* Authenticated */
          <>
            {/* Bell icon */}
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500">
              <FaBell className="text-base" />
            </button>

            {/* Avatar button */}
            <div className="relative">
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
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Logout */}
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