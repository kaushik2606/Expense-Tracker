import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    clearAuthError();

    try {
      const response = await api.post("/auth/login", { email, password });
      signIn(response.data);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to log in."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card border-0 shadow-sm w-100" style={{ maxWidth: "440px" }}>
        <div className="card-body p-4 p-md-5">
          <div className="mb-4">
            <p className="text-primary fw-semibold mb-2">Expense Tracker</p>
            <h1 className="h3 mb-2">Welcome back</h1>
            <p className="text-body-secondary mb-0">Sign in to manage your money.</p>
          </div>

          {(error || authError) && (
            <div className="alert alert-danger" role="alert">{error || authError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-body-secondary mt-4 mb-0">
            Don&apos;t have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
