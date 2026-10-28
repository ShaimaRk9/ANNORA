
import { useState } from "react";
import { LandingPage, LoginPage } from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
export default function App() {
  const [page, setPage] = useState("home");
  const [admin, setAdmin] = useState(null);

  async function handleLogout() {
    try {
      await fetch("http://localhost:5000/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setAdmin(null);
    setPage("home");
  }

  if (page === "dashboard") {
    return <AdminDashboard admin={admin} onLogout={handleLogout} />;
  }

  if (page === "login") {
    return (
      <LoginPage
        onBack={() => setPage("home")}
        onLoginSuccess={(loggedInAdmin) => {
          setAdmin(loggedInAdmin);
          setPage("dashboard");
        }}
      />
    );
  }

  return <LandingPage onLogin={() => setPage("login")} />;
}
