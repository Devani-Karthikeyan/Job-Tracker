import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful");
      navigate("/login");

    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form onSubmit={handleSubmit} className="bg-white p-6 w-80 rounded shadow">

        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          className="w-full p-2 border mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 border mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full p-2 border mb-3"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="w-full bg-blue-500 text-white p-2">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have account? <Link to="/login">Login</Link>
        </p>

      </form>
    </div>
  );
}

export default Register;