import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowProfile(false);
    navigate("/");
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/api/jobs/search?keyword=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectJob = (job) => {
    setSearch("");
    setResults([]);
    navigate(`/jobs/${job.id}`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex justify-between items-center">

      {/* LEFT */}
      <div className="text-lg font-bold text-blue-600">
        JobTracker
      </div>

      {/* SEARCH BAR */}
      {user && (
        <div className="relative w-96">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <FaSearch className="text-gray-500 mr-2" />

            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={handleSearch}
              className="bg-transparent outline-none w-full"
            />
          </div>

          {/* SEARCH RESULTS */}
          {results.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">

              {results.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className="p-4 border-b hover:bg-gray-100 cursor-pointer"
                >
                  <h3 className="font-semibold text-blue-600">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {job.company}
                  </p>

                  <p className="text-xs text-gray-500">
                    {job.location}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>
      )}

      {/* RIGHT */}
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