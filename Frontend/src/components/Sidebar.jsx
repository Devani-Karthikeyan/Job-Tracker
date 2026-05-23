import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaTachometerAlt,
  FaBriefcase,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import { getUser, logout } from "../features/auth/authService";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-64 min-h-screen border-r bg-white p-4 flex flex-col justify-between shadow-sm">

        {/* TOP SECTION */}
        <div>

          {/* LOGO */}
          <h2 className="text-2xl font-bold text-blue-600 mb-8">
            Job Tracker
          </h2>

          {/* USER INFO */}
          <div className="mb-8 p-4 bg-gray-100 rounded-xl">
            <p className="font-semibold text-gray-800">
              {user?.name || "Guest"}
            </p>

            <p className="text-sm text-gray-500 break-all">
              {user?.email || "No email"}
            </p>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2">

            <NavLink to="/dashboard" className={linkClass}>
              <FaTachometerAlt />
              Dashboard
            </NavLink>

            <NavLink to="/jobs" className={linkClass}>
              <FaBriefcase />
              Jobs
            </NavLink>

            <NavLink to="/add-job" className={linkClass}>
              <FaPlus />
              Add Job
            </NavLink>

          </nav>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            text-red-600
            hover:bg-red-50
            transition
            duration-200
            font-medium
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md">

            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Confirm Logout
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from your account?
            </p>

            <div className="flex justify-end gap-3">

              {/* CANCEL */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 font-medium"
              >
                Cancel
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition duration-200 font-medium"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Sidebar;