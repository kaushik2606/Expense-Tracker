import { createContext, useContext, useEffect, useState } from "react";
import api, { authConfig, getErrorMessage } from "../services/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "expense-tracker-token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;
    api
      .get("/auth/me", authConfig(token))
      .then(({ data }) => {
        if (isMounted) {
          setUser(data.data);
          setAuthError("");
        }
      })
      .catch((error) => {
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          setAuthError(getErrorMessage(error, "Your session could not be restored."));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const signIn = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.data);
    setAuthError("");
    setLoading(false);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthError("");
  };

  const value = {
    token,
    user,
    loading,
    authError,
    signIn,
    signOut,
    updateUser: setUser,
    clearAuthError: () => setAuthError(""),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};
