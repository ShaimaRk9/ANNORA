
import { useMemo, useState } from "react";
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
  Search,
  CalendarDays,
  MapPin,
  CheckCircle2,
  Clock3,
  Eye,
  X,
  Leaf,
  Utensils,
  TrendingUp,
  Users,
  Download,
} from "lucide-react";
import "./DonationHistory.css";

const donationRecords = [
  {
    id: "ANN-1002",
    food: "Fresh Bananas",
    category: "Fruits & Vegetables",
    quantity: "10 kg",
    portions: 40,
    ngo: "Green Life Foundation",
    date: "2026-10-21",
    completedDate: "2026-10-21",
    status: "Completed",
    address: "Registered business address",
    description: "Fresh bananas donated for community distribution.",
  },
  {
    id: "ANN-1003",
    food: "Vegetable Biryani",
    category: "Cooked Meals",
    quantity: "30 portions",
    portions: 30,
    ngo: "Hope Community NGO",
    date: "2026-10-18",
    completedDate: "2026-10-18",
    status: "Completed",
    address: "Registered business address",
    description: "Freshly prepared meals packed for collection.",
  },
  {
    id: "ANN-1004",
    food: "Bread and Sandwiches",
    category: "Bakery",
    quantity: "20 packs",
    portions: 20,
    ngo: "Helping Hands Trust",
    date: "2026-10-15",
    completedDate: "2026-10-15",
    status: "Completed",
    address: "Registered business address",
    description: "Surplus bakery items shared with local recipients.",
  },
  {
    id: "ANN-1005",
    food: "Fresh Apples",
    category: "Fruits & Vegetables",
    quantity: "8 kg",
    portions: 32,
    ngo: "Awaiting NGO",
    date: "2026-10-27",
    completedDate: "",
    status: "In Progress",
    address: "Registered business address",
    description: "Fresh fruit donation awaiting collection arrangements.",
  },
  {
    id: "ANN-1006",
    food: "Dal and Rice Meals",
    category: "Cooked Meals",
    quantity: "25 portions",
    portions: 25,
    ngo: "Community Food Network",
    date: "2026-10-12",
    completedDate: "2026-10-12",
    status: "Completed",
    address: "Registered business address",
    description: "Cooked meals provided for community food distribution.",
  },
  {
    id: "ANN-1007",
    food: "Seasonal Vegetables",
    category: "Fruits & Vegetables",
    quantity: "12 kg",
    portions: 36,
    ngo: "Awaiting NGO",
    date: "2026-10-10",
    completedDate: "",
    status: "Cancelled",
    address: "Registered business address",
    description: "Donation cancelled before pickup.",
  },
];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/donor/dashboard" },
  { label: "Create Donation", icon: Plus, path: "/donor/create-donation" },
  { label: "My Donations", icon: Package, path: "/donor/my-donations" },
  { label: "Pickup Tracking", icon: Truck, path: "/donor/pickup-tracking" },
  { label: "Donation History", icon: History, active: true },
  { label: "Business Profile", icon: Building2, path: "/donor/business-profile" },
  { label: "Licences & Verification", icon: ShieldCheck, path: "/donor/licences-verification" },
  { label: "Settings", icon: Settings, path: "/donor/settings" },
];

function formatDate(date) {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFoodIcon(category) {
  return category === "Cooked Meals" ? Utensils : Leaf;
}

export default function DonationHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState(null);

  const filteredDonations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return donationRecords.filter((donation) => {
      const matchesSearch = [
        donation.id,
        donation.food,
        donation.category,
        donation.ngo,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || donation.status === statusFilter;

      const donationDate = new Date(`${donation.date}T00:00:00`);
      const now = new Date("2026-10-27T00:00:00");
      const daysAgo = (now - donationDate) / (1000 * 60 * 60 * 24);

      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "30" && daysAgo >= 0 && daysAgo <= 30) ||
        (dateFilter === "7" && daysAgo >= 0 && daysAgo <= 7);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [search, statusFilter, dateFilter]);

  const completedDonations = donationRecords.filter(
    (item) => item.status === "Completed"
  );

  const totalPortions = completedDonations.reduce(
    (sum, item) => sum + item.portions,
    0
  );

  const handleExport = () => {
    const headers = [
      "Donation ID",
      "Food",
      "Category",
      "Quantity",
      "NGO",
      "Donation Date",
      "Status",
    ];

    const rows = filteredDonations.map((item) => [
      item.id,
      item.food,
      item.category,
      item.quantity,
      item.ngo,
      item.date,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "annora-donation-history.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="dh-layout">
      <aside className="dh-sidebar">
        <div className="dh-brand">
          <div className="dh-brand-icon">
            <HeartHandshake size={29} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <p>Food rescued. Hope restored.</p>
          </div>
        </div>

        <p className="dh-menu-label">DONOR MENU</p>

        <nav className="dh-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.label}
                className={`dh-nav-item ${item.active ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.path && !item.active}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="dh-sidebar-note">
          <Leaf size={25} />
          <strong>Every meal matters.</strong>
          <p>Help reduce food waste and nourish lives.</p>
        </div>
      </aside>

      <main className="dh-main">
        <header className="dh-header">
          <div>
            <p className="dh-eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Donation History</h1>
            <p className="dh-subtitle">
              Review your donations and see the impact you have made.
            </p>
          </div>

          <div className="dh-account">
            <div className="dh-account-icon">
              <Building2 size={22} />
            </div>
            <div>
              <strong>Your Business</strong>
              <span>Donor Account</span>
            </div>
            <span className="dh-account-dot" />
          </div>
        </header>

        <section className="dh-welcome-banner">
          <div className="dh-banner-icon">
            <History size={29} />
          </div>
          <div>
            <span>YOUR DONATION JOURNEY</span>
            <h2>Every donation creates a difference.</h2>
            <p>
              Your history keeps a record of the food rescued and the
              communities supported through ANNORA.
            </p>
          </div>
          <HeartHandshake className="dh-banner-decoration" size={82} />
        </section>

        <section className="dh-stats">
          <div className="dh-stat-card">
            <div className="dh-stat-icon dh-green">
              <Package size={24} />
            </div>
            <div>
              <span>Total Donations</span>
              <strong>{donationRecords.length}</strong>
              <small>All recorded donations</small>
            </div>
          </div>

          <div className="dh-stat-card">
            <div className="dh-stat-icon dh-purple">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span>Completed</span>
              <strong>{completedDonations.length}</strong>
              <small>Successfully collected</small>
            </div>
          </div>

          <div className="dh-stat-card">
            <div className="dh-stat-icon dh-orange">
              <Clock3 size={24} />
            </div>
            <div>
              <span>In Progress</span>
              <strong>
                {donationRecords.filter((item) => item.status === "In Progress").length}
              </strong>
              <small>Awaiting completion</small>
            </div>
          </div>

          <div className="dh-stat-card">
            <div className="dh-stat-icon dh-blue">
              <Utensils size={24} />
            </div>
            <div>
              <span>Meal Portions</span>
              <strong>{totalPortions}</strong>
              <small>From completed records</small>
            </div>
          </div>
        </section>

        <section className="dh-impact-strip">
          <div className="dh-impact-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <strong>Your impact is growing!</strong>
            <p>
              You have completed {completedDonations.length} sample donations,
              representing {totalPortions} food portions.
            </p>
          </div>
        </section>

        <section className="dh-history-section">
          <div className="dh-section-heading">
            <div>
              <h2>All Donation Records</h2>
              <p>Search, filter, and review your donation activity.</p>
            </div>
            <button
              type="button"
              className="dh-export-button"
              onClick={handleExport}
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>

          <div className="dh-filters">
            <label className="dh-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search food, donation ID or NGO..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            >
              <option value="All">All Dates</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          <div className="dh-record-count">
            Showing <strong>{filteredDonations.length}</strong> of{" "}
            <strong>{donationRecords.length}</strong> records
          </div>

          {filteredDonations.length === 0 ? (
            <div className="dh-empty">
              <Search size={36} />
              <h3>No donations found</h3>
              <p>Try changing your search text or filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setDateFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="dh-table-wrap">
              <table className="dh-table">
                <thead>
                  <tr>
                    <th>Donation</th>
                    <th>Quantity</th>
                    <th>NGO / Recipient</th>
                    <th>Donation Date</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation) => {
                    const FoodIcon = getFoodIcon(donation.category);

                    return (
                      <tr key={donation.id}>
                        <td>
                          <div className="dh-food-cell">
                            <div className="dh-food-icon">
                              <FoodIcon size={21} />
                            </div>
                            <div>
                              <strong>{donation.food}</strong>
                              <span>{donation.id}</span>
                              <small>{donation.category}</small>
                            </div>
                          </div>
                        </td>
                        <td className="dh-quantity">{donation.quantity}</td>
                        <td>
                          <div className="dh-ngo-cell">
                            <Users size={17} />
                            <span>{donation.ngo}</span>
                          </div>
                        </td>
                        <td>
                          <div className="dh-date-cell">
                            <CalendarDays size={15} />
                            {formatDate(donation.date)}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`dh-status ${
                              donation.status === "Completed"
                                ? "dh-status-completed"
                                : donation.status === "In Progress"
                                  ? "dh-status-progress"
                                  : "dh-status-cancelled"
                            }`}
                          >
                            {donation.status === "Completed" ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock3 size={14} />
                            )}
                            {donation.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="dh-view-button"
                            onClick={() => setSelectedDonation(donation)}
                            aria-label={`View ${donation.id} details`}
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="dh-disclaimer">
            Donation records shown here are sample data for UI development.
            Connect your backend to display verified donation history.
          </p>
        </section>

        <footer className="dh-footer">
          <HeartHandshake size={17} />
          ANNORA — Where Every Meal Finds Meaning.
        </footer>
      </main>

      {selectedDonation && (
        <div
          className="dh-modal-backdrop"
          onClick={() => setSelectedDonation(null)}
        >
          <section
            className="dh-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dh-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dh-modal-heading">
              <div>
                <p className="dh-eyebrow">DONATION RECORD</p>
                <h2 id="dh-modal-title">{selectedDonation.food}</h2>
                <span>{selectedDonation.id}</span>
              </div>
              <button
                type="button"
                className="dh-close-button"
                onClick={() => setSelectedDonation(null)}
                aria-label="Close donation details"
              >
                <X size={21} />
              </button>
            </div>

            <span
              className={`dh-status ${
                selectedDonation.status === "Completed"
                  ? "dh-status-completed"
                  : selectedDonation.status === "In Progress"
                    ? "dh-status-progress"
                    : "dh-status-cancelled"
              }`}
            >
              {selectedDonation.status === "Completed" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock3 size={14} />
              )}
              {selectedDonation.status}
            </span>

            <p className="dh-modal-description">
              {selectedDonation.description}
            </p>

            <dl className="dh-details-grid">
              <div>
                <dt>Food Category</dt>
                <dd>{selectedDonation.category}</dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{selectedDonation.quantity}</dd>
              </div>
              <div>
                <dt>Donation Date</dt>
                <dd>{formatDate(selectedDonation.date)}</dd>
              </div>
              <div>
                <dt>Completion Date</dt>
                <dd>{formatDate(selectedDonation.completedDate)}</dd>
              </div>
              <div>
                <dt>NGO / Recipient</dt>
                <dd>{selectedDonation.ngo}</dd>
              </div>
              <div>
                <dt>Pickup Address</dt>
                <dd>{selectedDonation.address}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="dh-modal-done"
              onClick={() => setSelectedDonation(null)}
            >
              Close Details
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
