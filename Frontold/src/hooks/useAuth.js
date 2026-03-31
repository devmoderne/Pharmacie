// src/hooks/useAuth.js
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const isAuthenticated = !!user;

  return { user, setUser, isAuthenticated };
};
