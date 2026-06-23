import { createContext, useContext, useState } from "react";

/* ─────────────────────────────────────────
   AuthContext
   ─────────────────────────────────────────
   Single source of truth for the currently
   logged-in user.

   • Initialises from localStorage so the user
     stays logged in after a page refresh.
   • login(userData, token) → saves to localStorage
     AND updates React state → Navbar re-renders immediately.
   • logout() → clears everything.
───────────────────────────────────────── */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
