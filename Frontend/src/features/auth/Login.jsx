import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useJobs } from "../../context/JobContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { refreshJobs } = useJobs();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      /*
        SUPPORTS BOTH:

        1)
        {
          token: "...",
          user: {
            id,
            name,
            email
          }
        }

        2)
        {
          id,
          name,
          email
        }
      */

      const token = data.token || null;
      const userData = data.user ? data.user : data;

      // ✅ Updates AuthContext → Navbar re-renders immediately (no refresh)
      login(userData, token);

      // ✅ Pre-fetch jobs → Dashboard shows data immediately (no refresh)
      refreshJobs();

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      if (error.response) {
        alert(error.response.data.message || "Login failed");
      } else {
        alert("Server not responding");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >

        <h2 className="text-2xl font-bold mb-5 text-center">
          Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>

        {/* REGISTER */}
        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>

      </form>
    </div>
  );
}

export default Login;