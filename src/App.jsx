import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

const RequireAuth = ({ children }) => {
  const { loading, token, user } = useAuth();

  if (loading) {
    return (
      <main className="container min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-body-secondary mb-0">Loading your account...</p>
      </main>
    );
  }

  return token && user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/dashboard"
      element={
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      }
    >
      <Route index element={<Home />} />
      <Route path="income" element={<Income />} />
      <Route path="expense" element={<Expense />} />
      <Route path="profile" element={<Profile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
