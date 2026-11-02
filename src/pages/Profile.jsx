import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api, { authConfig, getErrorMessage } from "../services/api";

const Profile = () => {
  const { token, user, updateUser, signOut } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setForm({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await api.put("/auth/me", form, authConfig(token));
      updateUser(response.data.data);
      setNotice("Your profile has been updated.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto" style={{ maxWidth: "760px" }}>
      <div className="mb-4">
        <h1 className="h2 mb-1">Profile</h1>
        <p className="text-body-secondary mb-0">Manage your account details.</p>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "56px", height: "56px" }}
              aria-hidden="true"
            >
              {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="h5 mb-1">{user?.name}</h2>
              <p className="text-body-secondary mb-0">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="profile-name">Full name</label>
              <input
                className="form-control"
                id="profile-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength="80"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="profile-email">Email address</label>
              <input
                className="form-control"
                id="profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2 className="h5 mb-1">Sign out</h2>
            <p className="text-body-secondary mb-0">End this session on this device.</p>
          </div>
          <button className="btn btn-outline-danger" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
