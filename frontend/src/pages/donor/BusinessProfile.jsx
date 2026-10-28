
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
  UserRound,
  Mail,
  Phone,
  MapPin,
  Clock,
  CalendarDays,
  Save,
  Pencil,
  Store,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import "./BusinessProfile.css";

const initialProfile = {
  businessName: "Your Business",
  ownerName: "",
  email: "",
  phone: "",
  businessType: "Restaurant",
  registrationNumber: "",
  address: "",
  city: "",
  state: "Maharashtra",
  pincode: "",
  openingTime: "09:00",
  closingTime: "21:00",
  description: "",
};

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/donor/dashboard" },
  { label: "Create Donation", icon: Plus, path: "/donor/create-donation" },
  { label: "My Donations", icon: Package, path: "/donor/my-donations" },
  { label: "Pickup Tracking", icon: Truck, path: "/donor/pickup-tracking" },
  { label: "Donation History", icon: History, path: "/donor/donation-history" },
  { label: "Business Profile", icon: Building2, active: true },
  {
    label: "Licences & Verification",
    icon: ShieldCheck,
    path: "/donor/licences-verification",
  },
  { label: "Settings", icon: Settings, path: "/donor/settings" },
];

export default function BusinessProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setEditing(false);
    setSaved(true);
  };

  const handleEdit = () => {
    setEditing(true);
    setSaved(false);
  };

  return (
    <div className="bp-layout">
      <aside className="bp-sidebar">
        <div className="bp-brand">
          <div className="bp-brand-icon">
            <HeartHandshake size={29} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <p>Food rescued. Hope restored.</p>
          </div>
        </div>

        <p className="bp-menu-label">DONOR MENU</p>

        <nav className="bp-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.label}
                className={`bp-nav-item ${item.active ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.path && !item.active}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="bp-sidebar-note">
          <Leaf size={25} />
          <strong>Every meal matters.</strong>
          <p>Help reduce food waste and nourish lives.</p>
        </div>
      </aside>

      <main className="bp-main">
        <header className="bp-header">
          <div>
            <p className="bp-eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Business Profile</h1>
            <p className="bp-subtitle">
              Manage your business information and donation pickup details.
            </p>
          </div>

          <div className="bp-account">
            <div className="bp-account-icon">
              <Building2 size={22} />
            </div>
            <div>
              <strong>{profile.businessName || "Your Business"}</strong>
              <span>Donor Account</span>
            </div>
            <span className="bp-account-dot" />
          </div>
        </header>

        <section className="bp-banner">
          <div className="bp-banner-icon">
            <Store size={29} />
          </div>
          <div>
            <span>YOUR BUSINESS, YOUR IMPACT</span>
            <h2>Build trust through your profile.</h2>
            <p>
              Keep your business details up to date so NGOs can coordinate
              food donations and pickups more easily.
            </p>
          </div>
          <Building2 className="bp-banner-decoration" size={82} />
        </section>

        <section className="bp-profile-summary">
          <div className="bp-avatar">
            <Building2 size={33} />
          </div>
          <div className="bp-summary-info">
            <h2>{profile.businessName || "Your Business"}</h2>
            <p>
              {profile.businessType || "Business type not selected"}
              {profile.city ? ` · ${profile.city}` : ""}
              {profile.state ? `, ${profile.state}` : ""}
            </p>
            <span className={`bp-profile-status ${saved ? "is-saved" : ""}`}>
              <CheckCircle2 size={15} />
              {saved ? "Changes saved in this session" : "Profile information"}
            </span>
          </div>
          {!editing && (
            <button
              type="button"
              className="bp-edit-button"
              onClick={handleEdit}
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </section>

        {saved && (
          <div className="bp-success-message" role="status">
            <CheckCircle2 size={19} />
            Your changes have been applied on this page.
            <span>Connect an API to save them permanently.</span>
          </div>
        )}

        <form className="bp-form" onSubmit={handleSave}>
          <section className="bp-card">
            <div className="bp-card-heading">
              <div className="bp-heading-icon">
                <Building2 size={20} />
              </div>
              <div>
                <h2>Business Information</h2>
                <p>Basic details about your business.</p>
              </div>
            </div>

            <div className="bp-fields">
              <label className="bp-field">
                <span>Business Name *</span>
                <input
                  name="businessName"
                  value={profile.businessName}
                  onChange={updateField}
                  placeholder="Enter business name"
                  required
                  disabled={!editing}
                />
              </label>

              <label className="bp-field">
                <span>Owner / Contact Person *</span>
                <input
                  name="ownerName"
                  value={profile.ownerName}
                  onChange={updateField}
                  placeholder="Enter owner or contact name"
                  required
                  disabled={!editing}
                />
              </label>

              <label className="bp-field">
                <span>Business Type *</span>
                <select
                  name="businessType"
                  value={profile.businessType}
                  onChange={updateField}
                  required
                  disabled={!editing}
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Bakery">Bakery</option>
                  <option value="College Canteen">College Canteen</option>
                  <option value="Catering Service">Catering Service</option>
                  <option value="Grocery Store">Grocery Store</option>
                  <option value="Event Organizer">Event Organizer</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="bp-field">
                <span>Business Registration Number</span>
                <input
                  name="registrationNumber"
                  value={profile.registrationNumber}
                  onChange={updateField}
                  placeholder="Enter registration number"
                  disabled={!editing}
                />
              </label>

              <label className="bp-field bp-full">
                <span>About Your Business</span>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={updateField}
                  placeholder="Describe your business and the food you typically donate..."
                  rows={4}
                  maxLength={500}
                  disabled={!editing}
                />
                <small>{profile.description.length}/500 characters</small>
              </label>
            </div>
          </section>

          <section className="bp-card">
            <div className="bp-card-heading">
              <div className="bp-heading-icon">
                <UserRound size={20} />
              </div>
              <div>
                <h2>Contact Information</h2>
                <p>How ANNORA and NGOs can reach you.</p>
              </div>
            </div>

            <div className="bp-fields">
              <label className="bp-field">
                <span>Email Address *</span>
                <div className="bp-input-icon">
                  <Mail size={17} />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={updateField}
                    placeholder="business@example.com"
                    required
                    disabled={!editing}
                  />
                </div>
              </label>

              <label className="bp-field">
                <span>Phone Number *</span>
                <div className="bp-input-icon">
                  <Phone size={17} />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={updateField}
                    placeholder="Enter contact number"
                    required
                    disabled={!editing}
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="bp-card">
            <div className="bp-card-heading">
              <div className="bp-heading-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h2>Business Address</h2>
                <p>Pickup location used to coordinate food collections.</p>
              </div>
            </div>

            <div className="bp-fields">
              <label className="bp-field bp-full">
                <span>Street Address *</span>
                <input
                  name="address"
                  value={profile.address}
                  onChange={updateField}
                  placeholder="Building, street, area"
                  required
                  disabled={!editing}
                />
              </label>

              <label className="bp-field">
                <span>City *</span>
                <input
                  name="city"
                  value={profile.city}
                  onChange={updateField}
                  placeholder="Enter city"
                  required
                  disabled={!editing}
                />
              </label>

              <label className="bp-field">
                <span>State *</span>
                <select
                  name="state"
                  value={profile.state}
                  onChange={updateField}
                  required
                  disabled={!editing}
                >
                  <option value="">Select state</option>
                  {[
                    "Andhra Pradesh",
                    "Assam",
                    "Bihar",
                    "Delhi",
                    "Goa",
                    "Gujarat",
                    "Haryana",
                    "Karnataka",
                    "Kerala",
                    "Madhya Pradesh",
                    "Maharashtra",
                    "Odisha",
                    "Punjab",
                    "Rajasthan",
                    "Tamil Nadu",
                    "Telangana",
                    "Uttar Pradesh",
                    "Uttarakhand",
                    "West Bengal",
                    "Other",
                  ].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>

              <label className="bp-field">
                <span>PIN Code *</span>
                <input
                  name="pincode"
                  value={profile.pincode}
                  onChange={updateField}
                  placeholder="6-digit PIN code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  disabled={!editing}
                />
              </label>
            </div>
          </section>

          <section className="bp-card">
            <div className="bp-card-heading">
              <div className="bp-heading-icon">
                <Clock size={20} />
              </div>
              <div>
                <h2>Operating & Pickup Hours</h2>
                <p>Help NGOs plan suitable donation pickup times.</p>
              </div>
            </div>

            <div className="bp-fields">
              <label className="bp-field">
                <span>Opening Time</span>
                <div className="bp-input-icon">
                  <CalendarDays size={17} />
                  <input
                    type="time"
                    name="openingTime"
                    value={profile.openingTime}
                    onChange={updateField}
                    disabled={!editing}
                  />
                </div>
              </label>

              <label className="bp-field">
                <span>Closing Time</span>
                <div className="bp-input-icon">
                  <CalendarDays size={17} />
                  <input
                    type="time"
                    name="closingTime"
                    value={profile.closingTime}
                    onChange={updateField}
                    disabled={!editing}
                  />
                </div>
              </label>
            </div>
          </section>

          {editing && (
            <div className="bp-form-actions">
              <button
                type="button"
                className="bp-cancel-button"
                onClick={() => {
                  setProfile(initialProfile);
                  setSaved(false);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="bp-save-button">
                <Save size={17} />
                Save Profile
              </button>
            </div>
          )}
        </form>

        <footer className="bp-footer">
          <HeartHandshake size={17} />
          ANNORA — Where Every Meal Finds Meaning.
        </footer>
      </main>
    </div>
  );
}
