import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { getErrorMessage } from "../services/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/register", form);
      signIn(response.data);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create your account."));
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
            <h1 className="h3 mb-2">Create your account</h1>
            <p className="text-body-secondary mb-0">Start tracking your income and expenses.</p>
          </div>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Full name</label>
              <input
                className="form-control"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength="80"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
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
                autoComplete="new-password"
                minLength="8"
                value={form.password}
                onChange={handleChange}
                required
              />
              <div className="form-text">Use at least 8 characters.</div>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-body-secondary mt-4 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
