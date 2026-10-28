
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
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Leaf,
} from "lucide-react";
import "./CreateDonation.css";

export default function CreateDonation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    foodName: "",
    category: "Cooked Meals",
    quantity: "",
    unit: "Portions",
    preparedAt: "",
    expiryAt: "",
    storage: "Room Temperature",
    description: "",
    pickupAddress: "",
    city: "",
    pincode: "",
    pickupDate: "",
    pickupTime: "",
    contactName: "",
    contactPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitted(false);
  };

  const generateDescription = () => {
    if (!form.foodName.trim()) {
      setErrors((previous) => ({
        ...previous,
        foodName: "Enter the food name first.",
      }));
      return;
    }

    const quantity = form.quantity
      ? `${form.quantity} ${form.unit.toLowerCase()}`
      : "available portions";

    setForm((previous) => ({
      ...previous,
      description:
        `${previous.foodName} (${previous.category}) is available for donation. ` +
        `Quantity: ${quantity}. ` +
        `Storage: ${previous.storage}. ` +
        "Please collect within the specified pickup window. " +
        "Confirm food safety and suitability before distribution.",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.foodName.trim()) {
      nextErrors.foodName = "Please enter the food name.";
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      nextErrors.quantity = "Enter a quantity greater than zero.";
    }

    if (!form.pickupAddress.trim()) {
      nextErrors.pickupAddress = "Enter the pickup address.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Enter the city.";
    }

    if (!form.contactName.trim()) {
      nextErrors.contactName = "Enter the contact person's name.";
    }

    if (!form.contactPhone.trim()) {
      nextErrors.contactPhone = "Enter a contact phone number.";
    }

    if (!form.expiryAt) {
      nextErrors.expiryAt = "Enter the food expiry or safe-use deadline.";
    }

    if (
      form.preparedAt &&
      form.expiryAt &&
      new Date(form.expiryAt) < new Date(form.preparedAt)
    ) {
      nextErrors.expiryAt =
        "The expiry time cannot be earlier than preparation time.";
    }

    if (
      form.pickupDate &&
      form.expiryAt &&
      new Date(`${form.pickupDate}T${form.pickupTime || "00:00"}`) >
        new Date(form.expiryAt)
    ) {
      nextErrors.pickupDate =
        "The pickup time must be before the expiry deadline.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});

    // Frontend-only for now. Connect your backend API to save the donation.
    setSubmitted(true);
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/donor/dashboard" },
    { label: "Create Donation", icon: Plus, active: true },
    { label: "My Donations", icon: Package, path: "/donor/my-donations" },
    { label: "Pickup Tracking", icon: Truck, path: "/donor/pickup-tracking" },
    { label: "Donation History", icon: History, path: "/donor/donation-history" },
    { label: "Business Profile", icon: Building2, path: "/donor/business-profile" },
    { label: "Licences & Verification", icon: ShieldCheck, path: "/donor/licences-verification" },
    { label: "Settings", icon: Settings, path: "/donor/settings" },
  ];

  return (
    <div className="cd-layout">
      <aside className="cd-sidebar">
        <div className="cd-brand">
          <div className="cd-brand-icon">
            <HeartHandshake size={29} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <p>Food rescued. Hope restored.</p>
          </div>
        </div>

        <p className="cd-menu-label">DONOR MENU</p>

        <nav className="cd-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`cd-nav-item ${item.active ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.path && !item.active}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="cd-sidebar-note">
          <Leaf size={25} />
          <strong>Every meal matters.</strong>
          <p>Help reduce food waste and nourish lives.</p>
        </div>
      </aside>

      <main className="cd-main">
        <header className="cd-topbar">
          <div>
            <p className="cd-eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Create Donation</h1>
            <p className="cd-subtitle">
              Share surplus food and help a nearby community.
            </p>
          </div>

          <button
            className="cd-back-button"
            type="button"
            onClick={() => navigate("/donor/dashboard")}
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>
        </header>

        <section className="cd-banner">
          <div className="cd-banner-icon">
            <HeartHandshake size={31} />
          </div>
          <div>
            <span>MAKE AN IMPACT TODAY</span>
            <h2>Give surplus food a second life.</h2>
            <p>
              Add accurate food and pickup details so eligible NGOs can
              assess your donation.
            </p>
          </div>
          <Leaf className="cd-banner-leaf" size={75} />
        </section>

        {submitted && (
          <div className="cd-success" role="status">
            <CheckCircle2 size={21} />
            <div>
              <strong>Form validated successfully!</strong>
              <p>
                Your donation has not been saved yet. Connect your backend
                API to store it and start NGO smart matching.
              </p>
            </div>
          </div>
        )}

        <form className="cd-form" onSubmit={handleSubmit} noValidate>
          <section className="cd-card">
            <div className="cd-section-heading">
              <div className="cd-section-icon">
                <Package size={21} />
              </div>
              <div>
                <h2>Food Details</h2>
                <p>Tell us about the surplus food you want to donate.</p>
              </div>
            </div>

            <div className="cd-fields">
              <div className="cd-field">
                <label htmlFor="foodName">Food Name *</label>
                <input
                  id="foodName"
                  name="foodName"
                  value={form.foodName}
                  onChange={updateField}
                  placeholder="e.g. Vegetable rice, sandwiches"
                />
                {errors.foodName && <small>{errors.foodName}</small>}
              </div>

              <div className="cd-field">
                <label htmlFor="category">Food Category *</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                >
                  <option>Cooked Meals</option>
                  <option>Bakery Products</option>
                  <option>Fruits & Vegetables</option>
                  <option>Packaged Food</option>
                  <option>Dairy Products</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="cd-field">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={updateField}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <small>{errors.quantity}</small>}
              </div>

              <div className="cd-field">
                <label htmlFor="unit">Quantity Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={form.unit}
                  onChange={updateField}
                >
                  <option>Portions</option>
                  <option>Kg</option>
                  <option>Grams</option>
                  <option>Packets</option>
                  <option>Boxes</option>
                  <option>Litres</option>
                </select>
              </div>

              <div className="cd-field">
                <label htmlFor="preparedAt">Preparation Date & Time</label>
                <input
                  id="preparedAt"
                  name="preparedAt"
                  type="datetime-local"
                  value={form.preparedAt}
                  onChange={updateField}
                />
              </div>

              <div className="cd-field">
                <label htmlFor="expiryAt">Safe-Use Deadline *</label>
                <input
                  id="expiryAt"
                  name="expiryAt"
                  type="datetime-local"
                  value={form.expiryAt}
                  onChange={updateField}
                />
                {errors.expiryAt && <small>{errors.expiryAt}</small>}
              </div>

              <div className="cd-field cd-field-full">
                <label htmlFor="storage">Storage Conditions</label>
                <select
                  id="storage"
                  name="storage"
                  value={form.storage}
                  onChange={updateField}
                >
                  <option>Room Temperature</option>
                  <option>Refrigerated</option>
                  <option>Frozen</option>
                  <option>Keep Hot</option>
                </select>
              </div>

              <div className="cd-field cd-field-full">
                <div className="cd-label-row">
                  <label htmlFor="description">Food Description</label>
                  <button
                    type="button"
                    className="cd-ai-button"
                    onClick={generateDescription}
                  >
                    <Sparkles size={15} />
                    AI Assist
                  </button>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={4}
                  placeholder="Describe ingredients, packaging, allergens, and other important details..."
                />
                <span className="cd-hint">
                  AI Assist creates a suggested description in your browser.
                  It is not connected to an AI service yet.
                </span>
              </div>
            </div>
          </section>

          <section className="cd-card">
            <div className="cd-section-heading">
              <div className="cd-section-icon">
                <Truck size={21} />
              </div>
              <div>
                <h2>Pickup Information</h2>
                <p>Help the NGO find and collect the donation.</p>
              </div>
            </div>

            <div className="cd-fields">
              <div className="cd-field cd-field-full">
                <label htmlFor="pickupAddress">Pickup Address *</label>
                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  value={form.pickupAddress}
                  onChange={updateField}
                  rows={2}
                  placeholder="Building, street, area, and landmark"
                />
                {errors.pickupAddress && (
                  <small>{errors.pickupAddress}</small>
                )}
              </div>

              <div className="cd-field">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  placeholder="e.g. Mumbai"
                />
                {errors.city && <small>{errors.city}</small>}
              </div>

              <div className="cd-field">
                <label htmlFor="pincode">PIN Code</label>
                <input
                  id="pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={updateField}
                  placeholder="6-digit PIN code"
                />
              </div>

              <div className="cd-field">
                <label htmlFor="pickupDate">Preferred Pickup Date</label>
                <input
                  id="pickupDate"
                  name="pickupDate"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.pickupDate}
                  onChange={updateField}
                />
                {errors.pickupDate && <small>{errors.pickupDate}</small>}
              </div>

              <div className="cd-field">
                <label htmlFor="pickupTime">Preferred Pickup Time</label>
                <input
                  id="pickupTime"
                  name="pickupTime"
                  type="time"
                  value={form.pickupTime}
                  onChange={updateField}
                />
              </div>
            </div>
          </section>

          <section className="cd-card">
            <div className="cd-section-heading">
              <div className="cd-section-icon">
                <Building2 size={21} />
              </div>
              <div>
                <h2>Donor Contact</h2>
                <p>Provide contact details for pickup coordination.</p>
              </div>
            </div>

            <div className="cd-fields">
              <div className="cd-field">
                <label htmlFor="contactName">Contact Person *</label>
                <input
                  id="contactName"
                  name="contactName"
                  value={form.contactName}
                  onChange={updateField}
                  placeholder="Full name"
                />
                {errors.contactName && <small>{errors.contactName}</small>}
              </div>

              <div className="cd-field">
                <label htmlFor="contactPhone">Contact Phone *</label>
                <input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={updateField}
                  placeholder="Phone number"
                />
                {errors.contactPhone && <small>{errors.contactPhone}</small>}
              </div>
            </div>
          </section>

          <div className="cd-food-safety">
            <ShieldCheck size={22} />
            <div>
              <strong>Food safety matters</strong>
              <p>
                Donate only food that has been handled and stored safely.
                Provide accurate preparation and expiry information, and
                disclose known allergens. Do not donate spoiled or unsafe food.
              </p>
            </div>
          </div>

          <div className="cd-actions">
            <button
              type="button"
              className="cd-cancel-button"
              onClick={() => navigate("/donor/dashboard")}
            >
              <ArrowLeft size={17} />
              Cancel
            </button>

            <button type="submit" className="cd-submit-button">
              Validate Donation Details
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <footer className="cd-footer">
          <HeartHandshake size={17} />
          ANNORA — Where Every Meal Finds Meaning.
        </footer>
      </main>
    </div>
  );
}
