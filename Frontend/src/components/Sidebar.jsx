import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBriefcase, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { getUser, logout } from "../features/auth/authService";
const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-lg ${
      isActive
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 h-screen border-r p-4 flex flex-col justify-between">

      {/* TOP */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-6">
          Job Tracker
        </h2>

        {/* USER */}
        <div className="mb-6 p-3 bg-gray-100 rounded">
          <p className="font-semibold">
            {user?.name || "Guest"}
          </p>
          <p className="text-sm text-gray-500">
            {user?.email || "No email"}
          </p>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            <FaTachometerAlt /> Dashboard
          </NavLink>

          <NavLink to="/jobs" className={linkClass}>
            <FaBriefcase /> Jobs
          </NavLink>

          <NavLink to="/add-job" className={linkClass}>
            <FaPlus /> Add Job
          </NavLink>
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-700"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;