
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  LayoutDashboard,
  Package,
  Truck,
  CheckCircle,
  Utensils,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  History,
  Building2,
  ShieldCheck,
  Settings,
  FileCheck,
  RefreshCw,
  AlertCircle,
  Leaf,
  HandHeart,
  Activity,
} from "lucide-react";

import "./DonorDashboard.css";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/donor/dashboard" },
  { label: "Create Donation", icon: Plus, path: "/donor/create-donation" },
  { label: "My Donations", icon: Package, path: "/donor/my-donations" },
  { label: "Pickup Tracking", icon: Truck, path: "/donor/pickup-tracking" },
  { label: "Donation History", icon: History, path: "/donor/donation-history" },
  { label: "Business Profile", icon: Building2, path: "/donor/business-profile" },
  { label: "Licences & Verification", icon: ShieldCheck, path: "/donor/licences-verification" },
  { label: "Settings", icon: Settings, path: "/donor/settings" },
];

const statConfig = [
  {
    key: "totalDonations",
    label: "Total Donations",
    icon: Package,
    color: "green",
  },
  {
    key: "activePickups",
    label: "Active Pickups",
    icon: Truck,
    color: "blue",
  },
  {
    key: "completedDonations",
    label: "Completed",
    icon: CheckCircle,
    color: "purple",
  },
  {
    key: "mealPortionsDonated",
    label: "Meal Portions Donated",
    icon: Utensils,
    color: "orange",
  },
];

const statusStyles = {
  OPEN: "status-open",
  PENDING_MATCHING: "status-pending",
  ACCEPTED: "status-accepted",
  PICKUP_ASSIGNED: "status-accepted",
  PICKED_UP: "status-picked",
  IN_TRANSIT: "status-picked",
  DELIVERED: "status-completed",
  COMPLETED: "status-completed",
  CANCELLED: "status-cancelled",
  EXPIRED: "status-cancelled",
};

const statusLabels = {
  OPEN: "Available",
  PENDING_MATCHING: "Matching",
  ACCEPTED: "Accepted",
  PICKUP_ASSIGNED: "Pickup Assigned",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLabel(value) {
  if (!value) return "Activity";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getBusinessName(data) {
  return (
    data?.business?.businessName ||
    data?.businessProfile?.businessName ||
    data?.donor?.businessName ||
    data?.businessName ||
    "Your Business"
  );
}

export default function DonorDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDonorDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = dashboard?.stats ?? {};
  const recentDonations = dashboard?.recentDonations ?? [];
  const recentActivities = dashboard?.recentActivities ?? [];

  const verification =
    dashboard?.verification ?? dashboard?.business?.verification ?? {};

  const verificationStatus =
    typeof verification === "string"
      ? verification
      : verification.status || "PENDING";

  const businessName = getBusinessName(dashboard);

  return (
    <div className="annora-dashboard">
      {/* Sidebar */}
      <aside className="annora-sidebar">
        <button
          className="annora-brand"
          onClick={() => navigate("/donor/dashboard")}
          aria-label="ANNORA Dashboard"
        >
          <span className="annora-brand-icon">
            <HeartHandshake size={28} />
          </span>

          <span>
            <strong>ANNORA</strong>
            <small>Food rescued. Hope restored.</small>
          </span>
        </button>

        <div className="sidebar-caption">DONOR MENU</div>

        <nav className="annora-nav">
          {navigationItems.map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              type="button"
              className={`annora-nav-item ${
                path === "/donor/dashboard" ? "active" : ""
              }`}
              onClick={() => navigate(path)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-mission">
            <Leaf size={22} />
            <p>Every meal matters.</p>
            <small>Help reduce food waste and nourish lives.</small>
          </div>

          <button
            className="annora-nav-item"
            type="button"
            onClick={() => navigate("/login")}
          >
            <ArrowRight size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="annora-main">
        {/* Top Header */}
        <header className="annora-topbar">
          <div className="topbar-title">
            <p className="eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Donor Dashboard</h1>
            <p className="page-description">
              Manage surplus food, track donations and make an impact.
            </p>
          </div>

          <div className="business-account">
            <div className="business-avatar">
              <Building2 size={20} />
            </div>

            <div className="business-account-info">
              <strong>{businessName}</strong>
              <span>Donor Account</span>
            </div>

            <span
              className={`verification-dot ${
                verificationStatus === "VERIFIED" ? "verified" : ""
              }`}
              title={`Verification: ${verificationStatus}`}
            />
          </div>
        </header>

        {error && (
          <div className="dashboard-error" role="alert">
            <AlertCircle size={20} />
            <span>{error}</span>

            <button type="button" onClick={loadDashboard}>
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading" aria-live="polite">
            <RefreshCw size={28} className="loading-icon" />
            <p>Loading your ANNORA dashboard...</p>
          </div>
        ) : (
          <>
            {/* Welcome Banner */}
            <section className="annora-welcome">
              <div className="welcome-content">
                <span className="welcome-label">
                  <HeartHandshake size={16} />
                  TOGETHER, WE MAKE A DIFFERENCE
                </span>

                <h2>Welcome back, {businessName}!</h2>

                <p>
                  Your surplus food can become someone's next meal.
                  Keep rescuing food and spreading hope.
                </p>

                <button
                  type="button"
                  className="welcome-button"
                  onClick={() => navigate("/donor/create-donation")}
                >
                  Create Donation
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="welcome-decoration" aria-hidden="true">
                <Utensils size={72} />
                <Leaf size={38} />
                <HeartHandshake size={45} />
              </div>
            </section>

            {/* Statistics */}
            <section className="donor-stats-grid">
              {statConfig.map(({ key, label, icon: Icon, color }) => (
                <article className="donor-stat-card" key={key}>
                  <div className={`stat-icon ${color}`}>
                    <Icon size={23} />
                  </div>

                  <div className="stat-details">
                    <p>{label}</p>
                    <h2>
                      {Number(stats[key] ?? 0).toLocaleString("en-IN")}
                    </h2>
                  </div>
                </article>
              ))}
            </section>

            {/* Recent Donations and Recent Activities */}
            <div className="dashboard-columns">
              <section className="dashboard-panel donations-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Donations</h2>
                    <p>Your latest food donations</p>
                  </div>

                  <button
                    type="button"
                    className="text-link"
                    onClick={() => navigate("/donor/my-donations")}
                  >
                    View All <ArrowRight size={15} />
                  </button>
                </div>

                {recentDonations.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Package size={28} />
                    </div>
                    <h3>No donations yet</h3>
                    <p>
                      Your food donations will appear here once you
                      create your first donation.
                    </p>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => navigate("/donor/create-donation")}
                    >
                      <Plus size={17} />
                      Create Donation
                    </button>
                  </div>
                ) : (
                  <div className="donation-table-wrap">
                    <table className="donation-table">
                      <thead>
                        <tr>
                          <th>Food Item</th>
                          <th>Quantity</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentDonations.map((donation) => (
                          <tr key={donation._id}>
                            <td>
                              <div className="food-item-cell">
                                <span className="food-item-icon">
                                  <Utensils size={17} />
                                </span>

                                <div>
                                  <strong>{donation.foodName}</strong>
                                  <small>
                                    {donation.foodCategory || "Food Donation"}
                                  </small>
                                </div>
                              </div>
                            </td>

                            <td>
                              {donation.quantity}{" "}
                              {donation.quantityUnit || ""}
                            </td>

                            <td>
                              <span
                                className={`donation-status ${
                                  statusStyles[donation.status] ||
                                  "status-pending"
                                }`}
                              >
                                {statusLabels[donation.status] ||
                                  formatLabel(donation.status)}
                              </span>
                            </td>

                            <td className="donation-date">
                              {formatDate(donation.createdAt)}
                              <button
                                type="button"
                                className="row-detail-link"
                                onClick={() =>
                                  navigate(
                                    `/donor/my-donations?id=${donation._id}`
                                  )
                                }
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Recent Activities */}
              <section className="dashboard-panel activities-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Activities</h2>
                    <p>Your latest donation updates</p>
                  </div>

                  <button
                    type="button"
                    className="text-link"
                    onClick={() => navigate("/donor/donation-history")}
                  >
                    View All <ArrowRight size={15} />
                  </button>
                </div>

                {recentActivities.length === 0 ? (
                  <div className="empty-state compact">
                    <Activity size={28} />
                    <h3>No recent activity</h3>
                    <p>
                      Donation, NGO request and pickup updates will
                      appear here.
                    </p>
                  </div>
                ) : (
                  <div className="activity-list">
                    {recentActivities.map((activity) => (
                      <article
                        className="activity-item"
                        key={activity._id}
                      >
                        <div className="activity-icon">
                          {activity.eventType?.includes("PICKUP") ? (
                            <Truck size={18} />
                          ) : activity.eventType?.includes("ACCEPTED") ? (
                            <HandHeart size={18} />
                          ) : (
                            <Package size={18} />
                          )}
                        </div>

                        <div className="activity-content">
                          <h3>
                            {formatLabel(activity.eventType)}
                          </h3>

                          <p>{activity.message}</p>

                          <span className="activity-time">
                            <Clock size={12} />
                            {formatDateTime(activity.createdAt)}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Quick Action and Verification */}
            <div className="dashboard-columns bottom-columns">
              <section className="quick-action-panel">
                <div className="quick-action-icon">
                  <HandHeart size={27} />
                </div>

                <div className="quick-action-content">
                  <h2>Ready to Rescue Food?</h2>
                  <p>
                    Create a new food donation and let ANNORA recommend
                    nearby eligible NGOs.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate("/donor/create-donation")}
                >
                  <Plus size={17} />
                  Create Donation
                </button>
              </section>

              <section className="dashboard-panel verification-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Verification Status</h2>
                    <p>Your business verification</p>
                  </div>

                  <ShieldCheck size={23} className="verification-icon" />
                </div>

                <div className="verification-row">
                  <FileCheck size={17} />
                  <span>FSSAI Licence</span>
                  <strong>{formatLabel(verification.fssaiStatus || verificationStatus)}</strong>
                </div>

                <div className="verification-row">
                  <FileCheck size={17} />
                  <span>Business Registration</span>
                  <strong>
                    {formatLabel(
                      verification.registrationStatus || verificationStatus
                    )}
                  </strong>
                </div>

                <div className="verification-row">
                  <ShieldCheck size={17} />
                  <span>Document Verification</span>
                  <strong>{formatLabel(verificationStatus)}</strong>
                </div>

                <button
                  type="button"
                  className="verification-link"
                  onClick={() =>
                    navigate("/donor/licences-verification")
                  }
                >
                  View Verification Details
                  <ArrowRight size={15} />
                </button>
              </section>
            </div>

            {/* Footer */}
            <footer className="annora-footer">
              <div>
                <HeartHandshake size={17} />
                <strong>ANNORA</strong>
              </div>

              <p>
                Where Every Meal Finds Meaning. Food rescued. Lives
                nourished. Hope restored.
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
