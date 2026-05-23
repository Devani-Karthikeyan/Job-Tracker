import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";

const Navbar = () => {

  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    console.log("Search:", e.target.value);
  };

  return (
  <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex justify-between items-center">

    {/* LEFT SIDE (you can add logo later) */}
    <div className="text-lg font-bold text-blue-600">
      JobTracker
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4 relative">

      {!user ? (
        <>
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>

          <Link to="/register" className="text-gray-600">
            Signup
          </Link>
        </>
      ) : (
        <>
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FaUserCircle className="text-2xl text-blue-600" />
            <span>{user.name}</span>
          </div>

          {showProfile && (
            <div className="absolute right-0 top-12 bg-white shadow-lg p-4 rounded-lg w-60">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>

              <button
                onClick={handleLogout}
                className="mt-3 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </>
      )}

    </div>
  </nav>
);
};

export default Navbar;