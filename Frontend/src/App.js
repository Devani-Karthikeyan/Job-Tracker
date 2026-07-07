import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import Jobs from "./pages/Jobs";
import EditJob from "./pages/EditJob";
import UserPreferences from "./pages/UserPreferences";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* LAYOUT */}
        <Route element={<Layout />}>

          {/* PUBLIC ROUTES */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* PRIVATE ROUTES */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-job"
            element={
              <ProtectedRoute>
                <AddJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <UserPreferences />
              </ProtectedRoute>
            }
          />

        </Route>


      </Routes>

    </BrowserRouter>
  );
}

export default App;