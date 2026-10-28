
import { useState } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { LandingPage, LoginPage } from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

import DonorDashboard from "./pages/donor/DonorDashboard.jsx";
import CreateDonation from "./pages/donor/CreateDonation.jsx";
import MyDonations from "./pages/donor/MyDonations.jsx";
import PickupTracking from "./pages/donor/PickupTracking.jsx";
import DonationHistory from "./pages/donor/DonationHistory.jsx";
import BusinessProfile from "./pages/donor/BusinessProfile.jsx";
import LicencesVerification from "./pages/donor/LicencesVerification.jsx";
import DonorSettings from "./pages/donor/DonorSettings.jsx";
import AISmartMatching from "./pages/donor/AISmartMatching.jsx";

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

  if (page === "home") {
    return <LandingPage onLogin={() => setPage("login")} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/donor/dashboard" replace />}
        />

        <Route
          path="/donor/dashboard"
          element={<DonorDashboard />}
        />
        <Route
          path="/donor/create-donation"
          element={<CreateDonation />}
        />
        <Route
          path="/donor/my-donations"
          element={<MyDonations />}
        />
        <Route
          path="/donor/pickup-tracking"
          element={<PickupTracking />}
        />
        <Route
          path="/donor/donation-history"
          element={<DonationHistory />}
        />
        <Route
          path="/donor/business-profile"
          element={<BusinessProfile />}
        />
        <Route
          path="/donor/licences-verification"
          element={<LicencesVerification />}
        />
        <Route
          path="/donor/settings"
          element={<DonorSettings />}
        />
        <Route
          path="/donor/ai-smart-matching"
          element={<AISmartMatching />}
        />

        <Route
          path="*"
          element={<Navigate to="/donor/dashboard" replace />}
        />
      </Routes>
    </HashRouter>
  );
}
