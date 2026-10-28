
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
  MapPin,
  Clock3,
  CalendarDays,
  CheckCircle2,
  Circle,
  Phone,
  Navigation,
  Leaf,
  Users,
  RefreshCw,
  ArrowRight,
  ClipboardList,
  Info,
} from "lucide-react";
import "./PickupTracking.css";

const samplePickups = [
  {
    id: "ANN-1001",
    food: "Vegetable Rice",
    category: "Cooked Meals",
    quantity: "25 portions",
    ngo: "Green Life Foundation",
    contact: "+91 98765 43210",
    address: "Your registered business address",
    pickupDate: "28 Oct 2026",
    pickupTime: "12:00 PM – 1:00 PM",
    status: "Pickup Scheduled",
    step: 2,
    created: "27 Oct 2026",
    notes: "Please keep the food packed in clean, food-safe containers.",
  },
  {
    id: "ANN-1005",
    food: "Fresh Apples",
    category: "Fruits & Vegetables",
    quantity: "8 kg",
    ngo: "Hope Community NGO",
    contact: "+91 98765 12340",
    address: "Your registered business address",
    pickupDate: "29 Oct 2026",
    pickupTime: "10:00 AM – 11:00 AM",
    status: "Waiting for NGO",
    step: 1,
    created: "27 Oct 2026",
    notes: "Keep the fruit in clean crates and ready for collection.",
  },
  {
    id: "ANN-1002",
    food: "Fresh Bananas",
    category: "Fruits & Vegetables",
    quantity: "10 kg",
    ngo: "Green Life Foundation",
    contact: "+91 98765 43210",
    address: "Your registered business address",
    pickupDate: "21 Oct 2026",
    pickupTime: "11:00 AM",
    status: "Completed",
    step: 4,
    created: "20 Oct 2026",
    notes: "Donation collected successfully.",
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/donor/dashboard" },
  { label: "Create Donation", icon: Plus, path: "/donor/create-donation" },
  { label: "My Donations", icon: Package, path: "/donor/my-donations" },
  { label: "Pickup Tracking", icon: Truck, active: true },
  { label: "Donation History", icon: History, path: "/donor/donation-history" },
  { label: "Business Profile", icon: Building2, path: "/donor/business-profile" },
  { label: "Licences & Verification", icon: ShieldCheck, path: "/donor/licences-verification" },
  { label: "Settings", icon: Settings, path: "/donor/settings" },
];

const trackingSteps = [
  {
    title: "Donation Created",
    description: "Your donation details have been submitted.",
    icon: ClipboardList,
  },
  {
    title: "NGO Matched",
    description: "An NGO has accepted your donation request.",
    icon: Users,
  },
  {
    title: "Pickup Scheduled",
    description: "The pickup time and collection details are confirmed.",
    icon: CalendarDays,
  },
  {
    title: "Food Collected",
    description: "The NGO has collected the donated food.",
    icon: CheckCircle2,
  },
];

export default function PickupTracking() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(samplePickups[0].id);
  const [showContact, setShowContact] = useState(false);

  const pickup = samplePickups.find((item) => item.id === selectedId)
    || samplePickups[0];

  const completed = pickup.status === "Completed";

  return (
    <div className="pt-layout">
      <aside className="pt-sidebar">
        <div className="pt-brand">
          <div className="pt-brand-icon">
            <HeartHandshake size={29} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <p>Food rescued. Hope restored.</p>
          </div>
        </div>

        <p className="pt-menu-label">DONOR MENU</p>

        <nav className="pt-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.label}
                className={`pt-nav-item ${item.active ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.path && !item.active}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-sidebar-note">
          <Leaf size={25} />
          <strong>Every meal matters.</strong>
          <p>Help reduce food waste and nourish lives.</p>
        </div>
      </aside>

      <main className="pt-main">
        <header className="pt-header">
          <div>
            <p className="pt-eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Pickup Tracking</h1>
            <p className="pt-subtitle">
              Follow your food donation from NGO acceptance to collection.
            </p>
          </div>

          <div className="pt-account">
            <div className="pt-account-icon">
              <Building2 size={22} />
            </div>
            <div>
              <strong>Your Business</strong>
              <span>Donor Account</span>
            </div>
            <span className="pt-account-dot" />
          </div>
        </header>

        <section className="pt-summary-banner">
          <div className="pt-summary-icon">
            <Truck size={31} />
          </div>
          <div>
            <span>DONATION COLLECTION STATUS</span>
            <h2>{completed ? "Donation Collected Successfully!" : pickup.status}</h2>
            <p>
              {completed
                ? "Thank you for helping good food reach people who need it."
                : "Track your collection details and stay updated on the pickup process."}
            </p>
          </div>
          <div className="pt-banner-decoration">
            <HeartHandshake size={75} />
          </div>
        </section>

        <section className="pt-select-card">
          <div className="pt-select-label">
            <Package size={20} />
            <div>
              <strong>Select a donation</strong>
              <span>Choose which pickup you want to track.</span>
            </div>
          </div>

          <select
            value={selectedId}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setShowContact(false);
            }}
            aria-label="Select donation to track"
          >
            {samplePickups.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} — {item.food}
              </option>
            ))}
          </select>
        </section>

        <section className="pt-progress-card">
          <div className="pt-section-heading">
            <div>
              <h2>Pickup Progress</h2>
              <p>Donation ID: {pickup.id}</p>
            </div>
            <span className={`pt-status ${completed ? "pt-status-complete" : "pt-status-active"}`}>
              {completed ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
              {pickup.status}
            </span>
          </div>

          <div className="pt-timeline">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isDone = index < pickup.step;
              const isCurrent = index === pickup.step && !completed;

              return (
                <div
                  className={`pt-timeline-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                  key={step.title}
                >
                  <div className="pt-step-marker">
                    {isDone ? <CheckCircle2 size={22} /> : isCurrent ? <Icon size={21} /> : <Circle size={21} />}
                  </div>
                  <div className="pt-step-content">
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                    {isCurrent && (
                      <span className="pt-current-label">CURRENT STAGE</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-progress-note">
            <Info size={18} />
            <p>
              {completed
                ? "This donation is marked as completed in the sample data."
                : "Pickup progress will update when your backend receives status updates from the NGO."}
            </p>
          </div>
        </section>

        <div className="pt-details-grid">
          <section className="pt-detail-card">
            <div className="pt-card-heading">
              <div className="pt-heading-icon">
                <Package size={21} />
              </div>
              <div>
                <h2>Donation Details</h2>
                <p>Food prepared for collection</p>
              </div>
            </div>

            <div className="pt-food-highlight">
              <div className="pt-food-icon">
                <Leaf size={27} />
              </div>
              <div>
                <h3>{pickup.food}</h3>
                <span>{pickup.category}</span>
              </div>
            </div>

            <div className="pt-info-row">
              <span>Donation ID</span>
              <strong>{pickup.id}</strong>
            </div>
            <div className="pt-info-row">
              <span>Quantity</span>
              <strong>{pickup.quantity}</strong>
            </div>
            <div className="pt-info-row">
              <span>Created on</span>
              <strong>{pickup.created}</strong>
            </div>
          </section>

          <section className="pt-detail-card">
            <div className="pt-card-heading">
              <div className="pt-heading-icon pt-heading-blue">
                <CalendarDays size={21} />
              </div>
              <div>
                <h2>Pickup Schedule</h2>
                <p>Collection arrangements</p>
              </div>
            </div>

            <div className="pt-schedule-box">
              <CalendarDays size={21} />
              <div>
                <span>Pickup Date</span>
                <strong>{pickup.pickupDate}</strong>
              </div>
            </div>

            <div className="pt-schedule-box">
              <Clock3 size={21} />
              <div>
                <span>Pickup Time</span>
                <strong>{pickup.pickupTime}</strong>
              </div>
            </div>

            <div className="pt-schedule-box">
              <MapPin size={21} />
              <div>
                <span>Collection Address</span>
                <strong>{pickup.address}</strong>
              </div>
            </div>
          </section>

          <section className="pt-detail-card pt-ngo-card">
            <div className="pt-card-heading">
              <div className="pt-heading-icon pt-heading-purple">
                <Users size={21} />
              </div>
              <div>
                <h2>Assigned NGO</h2>
                <p>Your donation collection partner</p>
              </div>
            </div>

            <div className="pt-ngo-profile">
              <div className="pt-ngo-avatar">
                <HeartHandshake size={29} />
              </div>
              <div>
                <h3>{pickup.ngo}</h3>
                <span>ANNORA NGO Partner</span>
              </div>
            </div>

            <div className="pt-verified">
              <CheckCircle2 size={16} />
              NGO assignment in sample data
            </div>

            {showContact && (
              <div className="pt-contact-details">
                <span>Sample contact number</span>
                <strong>{pickup.contact}</strong>
              </div>
            )}

            <button
              type="button"
              className="pt-contact-button"
              onClick={() => setShowContact((previous) => !previous)}
            >
              <Phone size={17} />
              {showContact ? "Hide Contact" : "View Contact Details"}
            </button>
          </section>

          <section className="pt-detail-card pt-instructions-card">
            <div className="pt-card-heading">
              <div className="pt-heading-icon pt-heading-orange">
                <Info size={21} />
              </div>
              <div>
                <h2>Pickup Instructions</h2>
                <p>Important collection notes</p>
              </div>
            </div>

            <p className="pt-instructions">{pickup.notes}</p>

            <ul className="pt-checklist">
              <li><CheckCircle2 size={17} /> Keep food in clean, food-safe packaging.</li>
              <li><CheckCircle2 size={17} /> Confirm quantity before handover.</li>
              <li><CheckCircle2 size={17} /> Follow applicable food-safety requirements.</li>
            </ul>
          </section>
        </div>

        <section className="pt-bottom-actions">
          <div>
            <h3>Need to check another donation?</h3>
            <p>View all your donation records or create a new donation.</p>
          </div>
          <div className="pt-action-buttons">
            <button
              type="button"
              className="pt-secondary-button"
              onClick={() => navigate("/donor/my-donations")}
            >
              <RefreshCw size={17} />
              My Donations
            </button>
            <button
              type="button"
              className="pt-primary-button"
              onClick={() => navigate("/donor/create-donation")}
            >
              Create Donation
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <footer className="pt-footer">
          <HeartHandshake size={17} />
          ANNORA — Where Every Meal Finds Meaning.
        </footer>
      </main>
    </div>
  );
}
