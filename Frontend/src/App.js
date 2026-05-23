import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* LAYOUT ROUTES */}
        <Route element={<Layout />}>

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PRIVATE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;