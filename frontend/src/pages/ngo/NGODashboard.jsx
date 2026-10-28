
import { useState, useEffect } from "react";
import "./NGODashboard.css";

const initialDonations = [
  {
    id: 1,
    name: "Mixed Veg Meal",
    quantity: "12 portions",
    location: "ABC Restaurant",
    date: "Today, 2:00 PM",
    icon: "🍱",
  },
  {
    id: 2,
    name: "Fresh Fruits",
    quantity: "20 kg",
    location: "Sunrise Hotel",
    date: "Today, 3:00 PM",
    icon: "🍎",
  },
  {
    id: 3,
    name: "Bread & Pastries",
    quantity: "15 portions",
    location: "Green Valley",
    date: "Today, 4:00 PM",
    icon: "🥖",
  },
  {
    id: 4,
    name: "Cooked Rice & Dal",
    quantity: "10 portions",
    location: "City Canteen",
    date: "Today, 5:00 PM",
    icon: "🍛",
  },
];

const initialActivity = [
  {
    id: 1,
    icon: "🤝",
    title: "Welcome to FoodBridge",
    detail: "Your NGO dashboard is ready.",
    time: "Just now",
  },
  {
    id: 2,
    icon: "🚚",
    title: "Pickup tracking",
    detail: "Track your claimed donations here.",
    time: "Get started",
  },
  {
    id: 3,
    icon: "🛡️",
    title: "Food safety reminder",
    detail: "Always check food quality before collection.",
    time: "Reminder",
  },
];

const navigation = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Available Donations", icon: "▦" },
  { name: "My Claims", icon: "♧" },
  { name: "Pickup Tracking", icon: "🚚" },
  { name: "Donation History", icon: "▤" },
  { name: "NGO Profile", icon: "♙" },
  { name: "Food Safety Guidelines", icon: "♡" },
  { name: "Settings", icon: "⚙" },
];

export default function NGODashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [donationError, setDonationError] = useState("");
  const [claims, setClaims] = useState([]);
  const [activity, setActivity] = useState(initialActivity);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  
useEffect(() => {
  async function fetchDonations() {
    try {
      setLoadingDonations(true);
      setDonationError("");

      const response = await fetch(
        "http://localhost:5000/api/donations"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch donations"
        );
      }

      const formattedDonations = data.donations.map((item) => ({
        ...item,
        id: item._id,
        name: item.foodName,
        quantity: `${item.quantity} ${item.unit || "portions"}`,
        location: item.pickupAddress,
        date: new Date(item.expiryTime).toLocaleString(),
        icon: "🍱",
      }));

      setDonations(formattedDonations);
    } catch (error) {
      setDonationError(error.message);
    } finally {
      setLoadingDonations(false);
    }
  }

  fetchDonations();
}, []);

  const pendingClaims = claims.filter(
    (claim) => claim.status === "Pending"
  ).length;

  const completedClaims = claims.filter(
    (claim) => claim.status === "Completed"
  ).length;

  const filteredDonations = donations.filter((donation) =>
    `${donation.name} ${donation.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addActivity(title, detail, icon = "🤝") {
    setActivity((previous) => [
      {
        id: Date.now(),
        icon,
        title,
        detail,
        time: "Just now",
      },
      ...previous,
    ]);
  }

//   function claimDonation(donation) {
//     const alreadyClaimed = claims.some(
//       (claim) => claim.donationId === donation.id
//     );

//     if (alreadyClaimed) return;

//     setClaims((previous) => [
//       ...previous,
//       {
//         ...donation,
//         donationId: donation.id,
//         status: "Pending",
//       },
//     ]);

//     addActivity(
//       `You claimed "${donation.name}"`,
//       `${donation.quantity} · Pickup pending`,
//       "🤝"
//     );
//   }


async function claimDonation(donation) {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login as an NGO first.");
      return;
    }

    const user = JSON.parse(savedUser);

    const ngoId =
      user?._id ||
      user?.id ||
      user?.user?._id ||
      user?.user?.id;

    const donationId = donation._id || donation.id;

    if (!ngoId || !donationId) {
      alert("NGO ID or Donation ID is missing.");
      console.log("Saved user:", user);
      console.log("Donation:", donation);
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/donations/${donationId}/claim`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ngoId }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Unable to claim donation.");
      return;
    }

    setDonations((previous) =>
      previous.filter(
        (item) =>
          String(item._id || item.id) !== String(donationId)
      )
    );

    setClaims((previous) => [
      ...previous.filter(
        (item) =>
          String(item.donationId) !== String(donationId)
      ),
      {
        ...donation,
        id: donationId,
        donationId,
        status: "Claimed",
      },
    ]);

    alert("Donation claimed successfully!");

  } catch (error) {
    console.error("Claim error:", error);
    alert("Cannot connect to backend. Check if backend is running.");
  }
}


  function cancelClaim(claim) {
    setClaims((previous) =>
      previous.filter((item) => item.donationId !== claim.donationId)
    );

    addActivity(
      `Claim cancelled: ${claim.name}`,
      "This claim was removed from your list.",
      "↩️"
    );
  }

  function renderDonations(items) {
    
if (loadingDonations) {
  return (
    <div className="ngo-empty">
      <span>⏳</span>
      <h3>Loading donations...</h3>
      <p>Please wait while we fetch available food donations.</p>
    </div>
  );
}

if (donationError) {
  return (
    <div className="ngo-empty">
      <span>⚠️</span>
      <h3>Unable to load donations</h3>
      <p>{donationError}</p>
      <button
        className="ngo-primary-btn"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}

    if (items.length === 0) {
      return (
        <div className="ngo-empty">
          <span>🍽️</span>
          <h3>No donations found</h3>
          <p>Try another search or check again later.</p>
        </div>
      );
    }

    return (
      <div className="ngo-table-wrap">
        <table className="ngo-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Pickup Location</th>
              <th>Pickup Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((donation) => {
              const isClaimed = claims.some(
                (claim) => claim.donationId === donation.id
              );

              return (
                <tr key={donation.id}>
                  <td>
                    <span className="ngo-food-name">
                      <span className="ngo-food-emoji">
                        {donation.icon}
                      </span>
                      {donation.name}
                    </span>
                  </td>
                  <td>{donation.quantity}</td>
                  <td>{donation.location}</td>
                  <td>{donation.date}</td>
                  <td>
                    <button
                      className={`ngo-claim-btn ${
                        isClaimed ? "is-claimed" : ""
                      }`}
                      onClick={() => claimDonation(donation)}
                      disabled={isClaimed}
                    >
                      {isClaimed ? "Claimed" : "Claim"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function renderPageContent() {
    switch (activePage) {
      case "Available Donations":
        return (
          <section className="ngo-panel">
            <div className="ngo-section-heading">
              <div>
                <h2>Available Donations</h2>
                <p>Find food donations for your community.</p>
              </div>
              <span className="ngo-count">
                {filteredDonations.length} available
              </span>
            </div>

            <div className="ngo-search">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search food or pickup location..."
              />
            </div>

            {renderDonations(filteredDonations)}
          </section>
        );

      case "My Claims":
        return (
          <section className="ngo-panel">
            <div className="ngo-section-heading">
              <div>
                <h2>My Claims</h2>
                <p>Manage the food donations claimed by your NGO.</p>
              </div>
              <span className="ngo-count">
                {claims.length} total
              </span>
            </div>

            {claims.length === 0 ? (
              <div className="ngo-empty">
                <span>📦</span>
                <h3>No claims yet</h3>
                <p>Visit Available Donations to claim food.</p>
                <button
                  className="ngo-primary-btn"
                  onClick={() => setActivePage("Available Donations")}
                >
                  Browse Donations
                </button>
              </div>
            ) : (
              <div className="ngo-claim-list">
                {claims.map((claim) => (
                  <article
                    className="ngo-claim-card"
                    key={claim.donationId}
                  >
                    <span className="ngo-large-emoji">
                      {claim.icon}
                    </span>
                    <div className="ngo-claim-info">
                      <h3>{claim.name}</h3>
                      <p>
                        {claim.quantity} · {claim.location}
                      </p>
                      <span className="ngo-status pending">
                        {claim.status}
                      </span>
                    </div>
                    <button
                      className="ngo-secondary-btn"
                      onClick={() => cancelClaim(claim)}
                    >
                      Cancel Claim
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        );

      case "Pickup Tracking":
        return (
          <section className="ngo-panel">
            <div className="ngo-section-heading">
              <div>
                <h2>Pickup Tracking</h2>
                <p>Check the status of your claimed donations.</p>
              </div>
            </div>

            {claims.length === 0 ? (
              <div className="ngo-empty">
                <span>🚚</span>
                <h3>No pickups scheduled</h3>
                <p>Your claimed donations will appear here.</p>
              </div>
            ) : (
              claims.map((claim) => (
                <article
                  className="ngo-claim-card"
                  key={claim.donationId}
                >
                  <span className="ngo-large-emoji">🚚</span>
                  <div className="ngo-claim-info">
                    <h3>{claim.name}</h3>
                    <p>Pickup: {claim.location}</p>
                    <span className="ngo-status pending">
                      {claim.status}
                    </span>
                  </div>
                </article>
              ))
            )}
          </section>
        );

      case "Donation History":
        return (
          <section className="ngo-panel">
            <h2>Donation History</h2>
            <p className="ngo-muted">
              Your claimed donations appear below.
            </p>
            {claims.length === 0 ? (
              <div className="ngo-empty">
                <span>📋</span>
                <h3>No donation history yet</h3>
                <p>Your claims will be listed here.</p>
              </div>
            ) : (
              renderDonations(
                claims.map((claim) => ({
                  ...claim,
                  id: claim.donationId,
                }))
              )
            )}
          </section>
        );

      case "NGO Profile":
        return (
          <section className="ngo-panel">
            <h2>NGO Profile</h2>
            <div className="ngo-profile-card">
              <div className="ngo-profile-avatar">HF</div>
              <div>
                <h3>Hope Foundation</h3>
                <p>NGO Representative</p>
                <span className="ngo-verified">✓ Verified NGO</span>
              </div>
            </div>
            <p className="ngo-muted">
              Profile editing and verification details can be
              connected to your backend later.
            </p>
          </section>
        );

      case "Food Safety Guidelines":
        return (
          <section className="ngo-panel">
            <h2>Food Safety Guidelines</h2>
            <p className="ngo-muted">
              Follow these basic checks before accepting a donation.
            </p>
            {[
              "Check the food preparation and expiry time.",
              "Reject food with unusual smell, appearance or spoilage.",
              "Use clean, food-safe containers for transportation.",
              "Keep hot and cold food at safe temperatures.",
              "Follow local food safety rules and your NGO's procedures.",
            ].map((guideline, index) => (
              <div className="ngo-guideline" key={guideline}>
                <span>{index + 1}</span>
                <p>{guideline}</p>
              </div>
            ))}
          </section>
        );

      case "Settings":
        return (
          <section className="ngo-panel">
            <h2>Settings</h2>
            <p className="ngo-muted">
              Notification preferences and account settings can
              be added here.
            </p>
            <div className="ngo-guideline">
              <span>🔔</span>
              <p>Donation and pickup notifications</p>
            </div>
            <div className="ngo-guideline">
              <span>🔒</span>
              <p>Account and security preferences</p>
            </div>
          </section>
        );

      default:
        return (
          <>
            <section className="ngo-welcome">
              <div>
                <span className="ngo-welcome-tag">
                  FOOD FOR EVERYONE
                </span>
                <h2>Welcome, Hope Foundation!</h2>
                <p>
                  Together we can reduce food waste and fight hunger.
                </p>
              </div>
              <div className="ngo-welcome-art" aria-hidden="true">
                🍲
              </div>
            </section>

            <section className="ngo-stats">
              <article className="ngo-stat-card">
                <div className="ngo-stat-icon green">♧</div>
                <div>
                  <p>Total Claims</p>
                  <h3>{claims.length}</h3>
                </div>
              </article>
              <article className="ngo-stat-card">
                <div className="ngo-stat-icon orange">🚚</div>
                <div>
                  <p>Pending Pickups</p>
                  <h3>{pendingClaims}</h3>
                </div>
              </article>
              <article className="ngo-stat-card">
                <div className="ngo-stat-icon blue">✓</div>
                <div>
                  <p>Completed Deliveries</p>
                  <h3>{completedClaims}</h3>
                </div>
              </article>
              <article className="ngo-stat-card">
                <div className="ngo-stat-icon purple">♙</div>
                <div>
                  <p>People Helped</p>
                  <h3>{completedClaims * 10}</h3>
                </div>
              </article>
            </section>

            <section className="ngo-content-grid">
              <div className="ngo-panel ngo-donations-panel">
                <div className="ngo-section-heading">
                  <div>
                    <h2>Available Donations</h2>
                    <p>Claim food for people who need it.</p>
                  </div>
                  <button
                    className="ngo-link-btn"
                    onClick={() =>
                      setActivePage("Available Donations")
                    }
                  >
                    View All →
                  </button>
                </div>

                {renderDonations(
                  showAll ? donations : donations.slice(0, 4)
                )}
              </div>

              <div className="ngo-right-column">
                <section className="ngo-panel">
                  <div className="ngo-section-heading">
                    <div>
                      <h2>Recent Activity</h2>
                      <p>Your latest updates</p>
                    </div>
                    <button
                      className="ngo-link-btn"
                      onClick={() => setShowAll((value) => !value)}
                    >
                      {showAll ? "Less" : "View All"}
                    </button>
                  </div>

                  <div className="ngo-activity-list">
                    {activity
                      .slice(0, showAll ? activity.length : 4)
                      .map((item) => (
                        <article
                          className="ngo-activity"
                          key={item.id}
                        >
                          <span className="ngo-activity-icon">
                            {item.icon}
                          </span>
                          <div>
                            <h4>{item.title}</h4>
                            <p>{item.detail}</p>
                            <small>{item.time}</small>
                          </div>
                        </article>
                      ))}
                  </div>
                </section>

                <section className="ngo-safety-card">
                  <div className="ngo-safety-icon">🛡️</div>
                  <div>
                    <h3>Food Safety Guidelines</h3>
                    <p>
                      Follow safe food handling practices before
                      distribution.
                    </p>
                    <button
                      className="ngo-primary-btn"
                      onClick={() =>
                        setActivePage("Food Safety Guidelines")
                      }
                    >
                      View Guidelines
                    </button>
                  </div>
                </section>
              </div>
            </section>

            <section className="ngo-pickup-banner">
              <div className="ngo-stat-icon green">🚚</div>
              <div>
                <h3>Pickup Tracking</h3>
                <p>Keep track of your claimed donations.</p>
              </div>
              <button
                className="ngo-primary-btn"
                onClick={() => setActivePage("Pickup Tracking")}
              >
                View Pickups
              </button>
            </section>
          </>
        );
    }
  }

  return (
    <div className="ngo-app">
      <aside className="ngo-sidebar">
        <div className="ngo-brand">
          <div className="ngo-brand-mark">♥</div>
          <div>
            <h2>ANNORA</h2>
            <p>Good Food. Greater Impact.</p>
          </div>
        </div>

        <p className="ngo-menu-label">NGO MENU</p>

        <nav className="ngo-nav">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name ? "active" : ""
              }
              onClick={() => setActivePage(item.name)}
            >
              <span className="ngo-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          className="ngo-logout"
          onClick={() => {
            setActivePage("Dashboard");
            addActivity(
              "Dashboard reopened",
              "You returned to the dashboard.",
              "↩️"
            );
          }}
        >
          <span>↪</span> Back to Dashboard
        </button>
      </aside>

      <main className="ngo-main">
        <header className="ngo-topbar">
          <div className="ngo-topbar-title">
            <p>NGO PORTAL</p>
            <h1>{activePage}</h1>
          </div>

          <div className="ngo-user">
            <div className="ngo-user-logo">H</div>
            <div className="ngo-user-details">
              <strong>Hope Foundation</strong>
              <span>✓ Verified NGO</span>
            </div>
            <span className="ngo-user-arrow">⌄</span>
          </div>
        </header>

        <div className="ngo-page-content">{renderPageContent()}</div>

        <footer className="ngo-footer">
          ANNORA © 2026 · Reducing food waste, fighting hunger.
        </footer>
      </main>
    </div>
  );
}
