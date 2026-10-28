
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  LayoutDashboard,
  Plus,
  Package,
  Truck,
  History,
  Building2,
  ShieldCheck,
  Settings,
  Bell,
  LockKeyhole,
  UserRound,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  LogOut,
  Globe,
} from "lucide-react";
import "./DonorSettings.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/donor/dashboard" },
  { label: "Create Donation", icon: Plus, path: "/donor/create-donation" },
  { label: "My Donations", icon: Package, path: "/donor/my-donations" },
  { label: "Pickup Tracking", icon: Truck, path: "/donor/pickup-tracking" },
  { label: "Donation History", icon: History, path: "/donor/donation-history" },
  { label: "Business Profile", icon: Building2, path: "/donor/business-profile" },
  {
    label: "Licences & Verification",
    icon: ShieldCheck,
    path: "/donor/licences-verification",
  },
  { label: "Settings", icon: Settings, active: true },
];

export default function DonorSettings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    language: "English",
  });

  const [notifications, setNotifications] = useState({
    donationUpdates: true,
    pickupUpdates: true,
    ngoRequests: true,
    email: true,
    sms: false,
    announcements: false,
  });

  const [privacy, setPrivacy] = useState({
    showBusiness: true,
    sharePickupContact: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const updateProfile = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
    setMessage("");
  };

  const toggleNotification = (key) => {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setMessage("");
  };

  const togglePrivacy = (key) => {
    setPrivacy((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setMessage("");
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const saveSettings = (event) => {
    event.preventDefault();
    showMessage(
      "Settings updated on this page. Connect your backend API to save them permanently.",
    );
  };

  const changePassword = (event) => {
    event.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showMessage("Please fill in all password fields.", "error");
      return;
    }

    if (passwords.next.length < 8) {
      showMessage("Your new password must contain at least 8 characters.", "error");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      showMessage("The new password and confirmation do not match.", "error");
      return;
    }

    showMessage(
      "Password form validated. Connect your secure backend password-change endpoint to complete this action.",
      "success",
    );

    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings on this page to their defaults?")) {
      setProfile({ name: "", email: "", phone: "", language: "English" });
      setNotifications({
        donationUpdates: true,
        pickupUpdates: true,
        ngoRequests: true,
        email: true,
        sms: false,
        announcements: false,
      });
      setPrivacy({ showBusiness: true, sharePickupContact: true });
      setPasswords({ current: "", next: "", confirm: "" });
      setMessage("Settings reset to their default values.");
      setMessageType("success");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="ds-layout">
      <aside className="ds-sidebar">
        <div className="ds-brand">
          <div className="ds-brand-icon">
            <HeartHandshake size={29} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <p>Food rescued. Hope restored.</p>
          </div>
        </div>

        <p className="ds-menu-label">DONOR MENU</p>

        <nav className="ds-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.label}
                className={`ds-nav-item ${item.active ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.path && !item.active}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="ds-sidebar-note">
          <Leaf size={25} />
          <strong>Every meal matters.</strong>
          <p>Help reduce food waste and nourish lives.</p>
        </div>
      </aside>

      <main className="ds-main">
        <header className="ds-header">
          <div>
            <p className="ds-eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Settings</h1>
            <p className="ds-subtitle">
              Manage your account, notifications, security, and privacy.
            </p>
          </div>

          <div className="ds-account">
            <div className="ds-account-icon">
              <UserRound size={22} />
            </div>
            <div>
              <strong>{profile.name || "Donor Account"}</strong>
              <span>Account preferences</span>
            </div>
          </div>
        </header>

        <section className="ds-banner">
          <div className="ds-banner-icon">
            <Settings size={29} />
          </div>
          <div>
            <span>YOUR ACCOUNT, YOUR CHOICES</span>
            <h2>Make ANNORA work for you.</h2>
            <p>
              Keep your contact details up to date and choose how you receive
              donation and pickup notifications.
            </p>
          </div>
          <LockKeyhole className="ds-banner-decoration" size={80} />
        </section>

        {message && (
          <div className={`ds-message ds-message-${messageType}`} role="status">
            {messageType === "error" ? (
              <AlertTriangle size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}
            <span>{message}</span>
            <button type="button" onClick={() => setMessage("")} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        <form onSubmit={saveSettings}>
          <section className="ds-card">
            <div className="ds-section-heading">
              <div className="ds-heading-icon">
                <UserRound size={20} />
              </div>
              <div>
                <h2>Account Information</h2>
                <p>Update the contact information associated with your account.</p>
              </div>
            </div>

            <div className="ds-fields">
              <label className="ds-field">
                <span>Full Name</span>
                <div className="ds-input-icon">
                  <UserRound size={17} />
                  <input
                    name="name"
                    value={profile.name}
                    onChange={updateProfile}
                    placeholder="Enter your full name"
                  />
                </div>
              </label>

              <label className="ds-field">
                <span>Email Address</span>
                <div className="ds-input-icon">
                  <Mail size={17} />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={updateProfile}
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="ds-field">
                <span>Phone Number</span>
                <div className="ds-input-icon">
                  <Smartphone size={17} />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={updateProfile}
                    placeholder="Enter your phone number"
                  />
                </div>
              </label>

              <label className="ds-field">
                <span>Language</span>
                <div className="ds-input-icon">
                  <Globe size={17} />
                  <select
                    name="language"
                    value={profile.language}
                    onChange={updateProfile}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
                </div>
              </label>
            </div>
          </section>

          <section className="ds-card">
            <div className="ds-section-heading">
              <div className="ds-heading-icon">
                <Bell size={20} />
              </div>
              <div>
                <h2>Notification Preferences</h2>
                <p>Choose which updates you want to receive.</p>
              </div>
            </div>

            <div className="ds-setting-list">
              <SettingToggle
                title="Donation Updates"
                description="Updates when donations are created or claimed."
                checked={notifications.donationUpdates}
                onChange={() => toggleNotification("donationUpdates")}
              />
              <SettingToggle
                title="Pickup & Delivery Updates"
                description="Pickup confirmation, collection, and completion updates."
                checked={notifications.pickupUpdates}
                onChange={() => toggleNotification("pickupUpdates")}
              />
              <SettingToggle
                title="NGO Requests"
                description="Notifications about NGO interest and matching activity."
                checked={notifications.ngoRequests}
                onChange={() => toggleNotification("ngoRequests")}
              />
              <SettingToggle
                title="Email Notifications"
                description="Receive important account and donation emails."
                checked={notifications.email}
                onChange={() => toggleNotification("email")}
              />
              <SettingToggle
                title="SMS Notifications"
                description="Receive supported updates by text message."
                checked={notifications.sms}
                onChange={() => toggleNotification("sms")}
              />
              <SettingToggle
                title="ANNORA Announcements"
                description="Occasional news, product updates, and platform notices."
                checked={notifications.announcements}
                onChange={() => toggleNotification("announcements")}
              />
            </div>
          </section>

          <section className="ds-card">
            <div className="ds-section-heading">
              <div className="ds-heading-icon">
                <LockKeyhole size={20} />
              </div>
              <div>
                <h2>Security & Password</h2>
                <p>Use a strong password to protect your account.</p>
              </div>
            </div>

            <div className="ds-fields">
              {[
                { key: "current", label: "Current Password" },
                { key: "next", label: "New Password" },
                { key: "confirm", label: "Confirm New Password" },
              ].map((field) => (
                <label className="ds-field" key={field.key}>
                  <span>{field.label}</span>
                  <div className="ds-password-input">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={passwords[field.key]}
                      onChange={(event) =>
                        setPasswords((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                      autoComplete={
                        field.key === "current" ? "current-password" : "new-password"
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((value) => !value)}
                      aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                    >
                      {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </label>
              ))}
            </div>

            <button
              type="button"
              className="ds-secondary-button ds-password-button"
              onClick={changePassword}
            >
              <LockKeyhole size={16} />
              Validate Password Change
            </button>
          </section>

          <section className="ds-card">
            <div className="ds-section-heading">
              <div className="ds-heading-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2>Privacy Preferences</h2>
                <p>Control how your business information is shared.</p>
              </div>
            </div>

            <div className="ds-setting-list">
              <SettingToggle
                title="Show Business Name to Matched NGOs"
                description="Allow matched NGOs to see your business name."
                checked={privacy.showBusiness}
                onChange={() => togglePrivacy("showBusiness")}
              />
              <SettingToggle
                title="Share Pickup Contact Details"
                description="Share your pickup contact details with the assigned NGO."
                checked={privacy.sharePickupContact}
                onChange={() => togglePrivacy("sharePickupContact")}
              />
            </div>
          </section>

          <div className="ds-actions">
            <button
              type="button"
              className="ds-secondary-button"
              onClick={handleReset}
            >
              Reset Defaults
            </button>
            <button type="submit" className="ds-primary-button">
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </form>

        <section className="ds-danger-card">
          <div className="ds-danger-icon">
            <LogOut size={22} />
          </div>
          <div className="ds-danger-copy">
            <h2>Account Actions</h2>
            <p>
              Sign out of your current donor session when using a shared device.
            </p>
          </div>
          <button
            type="button"
            className="ds-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Go to Login
          </button>
        </section>

        <footer className="ds-footer">
          <HeartHandshake size={17} />
          ANNORA — Where Every Meal Finds Meaning.
        </footer>
      </main>
    </div>
  );
}

function SettingToggle({ title, description, checked, onChange }) {
  return (
    <div className="ds-setting-row">
      <div className="ds-setting-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`ds-switch ${checked ? "is-on" : ""}`}
        onClick={onChange}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}
