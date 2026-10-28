import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  HeartHandshake,
  Package,
  Truck,
  History,
  Building2,
  FileCheck,
  Settings,
  Bell,
  Search,
  MapPin,
  Users,
  Utensils,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  SlidersHorizontal,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import "./AISmartMatching.css";

const ngos = [
  {
    id: 1,
    name: "Hope Foundation",
    type: "Community NGO",
    distance: 1.8,
    score: 98,
    foodTypes: ["Cooked Meals", "Vegetarian"],
    capacity: "120 meals",
    beneficiaries: 120,
    response: "Usually responds within 10 min",
    address: "Andheri East, Mumbai",
    description:
      "Provides daily meals to families, elderly people, and community shelters.",
    verified: true,
  },
  {
    id: 2,
    name: "Helping Hands Trust",
    type: "Food Rescue NGO",
    distance: 3.2,
    score: 94,
    foodTypes: ["Cooked Meals", "Bakery"],
    capacity: "80 meals",
    beneficiaries: 80,
    response: "Usually responds within 15 min",
    address: "Marol, Mumbai",
    description:
      "Collects surplus food from local businesses and distributes it to people in need.",
    verified: true,
  },
  {
    id: 3,
    name: "Annapurna Seva Group",
    type: "Community Kitchen",
    distance: 4.6,
    score: 89,
    foodTypes: ["Vegetarian", "Cooked Meals"],
    capacity: "100 meals",
    beneficiaries: 100,
    response: "Usually responds within 20 min",
    address: "Powai, Mumbai",
    description:
      "Supports community kitchens and underserved neighbourhoods with meal distribution.",
    verified: true,
  },
  {
    id: 4,
    name: "Care for All Society",
    type: "Social Welfare NGO",
    distance: 6.1,
    score: 84,
    foodTypes: ["Bakery", "Packaged Food"],
    capacity: "60 meals",
    beneficiaries: 60,
    response: "Response time varies",
    address: "Goregaon East, Mumbai",
    description:
      "Coordinates food support for shelters and vulnerable communities.",
    verified: false,
  },
];

const navItems = [
  { label: "Dashboard", path: "/donor/dashboard", icon: LayoutDashboard },
  { label: "Create Donation", path: "/donor/create-donation", icon: PlusCircle },
  { label: "AI Smart Matching", path: "/donor/ai-smart-matching", icon: HeartHandshake },
  { label: "My Donations", path: "/donor/my-donations", icon: Package },
  { label: "Pickup Tracking", path: "/donor/pickup-tracking", icon: Truck },
  { label: "Donation History", path: "/donor/donation-history", icon: History },
  { label: "Business Profile", path: "/donor/business-profile", icon: Building2 },
  { label: "Licences & Verification", path: "/donor/licences-verification", icon: FileCheck },
  { label: "Settings", path: "/donor/settings", icon: Settings },
];

export default function AISmartMatching() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [maxDistance, setMaxDistance] = useState("10");
  const [foodType, setFoodType] = useState("All Food Types");
  const [sortBy, setSortBy] = useState("score");
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("Recommended");

  const filteredNgos = useMemo(() => {
    let result = ngos.filter((ngo) => {
      const matchesSearch =
        ngo.name.toLowerCase().includes(search.toLowerCase()) ||
        ngo.address.toLowerCase().includes(search.toLowerCase());

      const matchesDistance = ngo.distance <= Number(maxDistance);

      const matchesFood =
        foodType === "All Food Types" || ngo.foodTypes.includes(foodType);

      const matchesTab =
        activeTab === "Recommended" ||
        (activeTab === "Requests Sent" && sentRequests.includes(ngo.id));

      return matchesSearch && matchesDistance && matchesFood && matchesTab;
    });

    return result.sort((a, b) =>
      sortBy === "distance" ? a.distance - b.distance : b.score - a.score
    );
  }, [search, maxDistance, foodType, sortBy, activeTab, sentRequests]);

  const sendRequest = (ngo) => {
    if (sentRequests.includes(ngo.id)) {
      setNotice(`Your request to ${ngo.name} has already been sent.`);
      return;
    }

    setSentRequests((previous) => [...previous, ngo.id]);
    setNotice(
      `Demo request sent to ${ngo.name}. Connect your backend to broadcast real requests.`
    );
    setSelectedNgo(null);
    setActiveTab("Requests Sent");
  };

  return (
    <div className="sm-page">
      <aside className="sm-sidebar">
        <div className="sm-brand">
          <div className="sm-brand-icon">
            <HeartHandshake size={25} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <span>Food Rescue Platform</span>
          </div>
        </div>

        <div className="sm-menu-title">DONOR MENU</div>

        <nav className="sm-nav">
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              className={`sm-nav-item ${
                label === "AI Smart Matching" ? "active" : ""
              }`}
              onClick={() => navigate(path)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sm-sidebar-bottom">
          <div className="sm-help-card">
            <Sparkles size={20} />
            <strong>Rescue more food</strong>
            <p>Every donation can make a meaningful difference.</p>
          </div>
          <button className="sm-nav-item" onClick={() => navigate("/login")}>
            <LogOut size={19} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="sm-main">
        <header className="sm-header">
          <div>
            <div className="sm-breadcrumb">Donor / AI Smart Matching</div>
            <h1>AI Smart Matching</h1>
            <p>Find the right NGO for your surplus food donation.</p>
          </div>
          <button
            className="sm-notification"
            aria-label="Notifications"
            onClick={() => setNotice("You have no new notifications.")}
          >
            <Bell size={21} />
            <span />
          </button>
        </header>

        {notice && (
          <div className="sm-notice" role="status">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
              <X size={17} />
            </button>
          </div>
        )}

        <section className="sm-hero">
          <div className="sm-hero-content">
            <div className="sm-ai-label">
              <BrainCircuit size={16} /> AI-POWERED RECOMMENDATIONS
            </div>
            <h2>Let's find your food a new purpose.</h2>
            <p>
              Our matching demo ranks NGOs using sample distance, food
              requirements, capacity, and compatibility data.
            </p>
            <button
              className="sm-primary-btn"
              onClick={() => navigate("/donor/create-donation")}
            >
              <PlusCircle size={18} /> Create a Donation
            </button>
          </div>
          <div className="sm-hero-art">
            <div className="sm-art-circle">
              <HeartHandshake size={60} strokeWidth={1.5} />
            </div>
            <span className="sm-art-spark sm-spark-one">✦</span>
            <span className="sm-art-spark sm-spark-two">✧</span>
            <span className="sm-art-dot" />
          </div>
        </section>

        <section className="sm-stat-grid">
          <div className="sm-stat-card">
            <div className="sm-stat-icon green"><HeartHandshake size={22} /></div>
            <div>
              <span>Potential NGO Matches</span>
              <h3>{ngos.length}</h3>
              <small>Sample recommendations</small>
            </div>
          </div>
          <div className="sm-stat-card">
            <div className="sm-stat-icon blue"><Users size={22} /></div>
            <div>
              <span>Potential Meal Reach</span>
              <h3>360+</h3>
              <small>Estimated sample capacity</small>
            </div>
          </div>
          <div className="sm-stat-card">
            <div className="sm-stat-icon orange"><MapPin size={22} /></div>
            <div>
              <span>Nearest Match</span>
              <h3>1.8 km</h3>
              <small>Based on sample locations</small>
            </div>
          </div>
          <div className="sm-stat-card">
            <div className="sm-stat-icon purple"><Sparkles size={22} /></div>
            <div>
              <span>Best Match Score</span>
              <h3>98%</h3>
              <small>Illustrative compatibility score</small>
            </div>
          </div>
        </section>

        <section className="sm-filter-card">
          <div className="sm-section-heading">
            <div>
              <h2>Find Matching NGOs</h2>
              <p>Filter recommendations to fit your donation.</p>
            </div>
            <SlidersHorizontal size={21} />
          </div>

          <div className="sm-filters">
            <label className="sm-search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search NGO or location..."
              />
            </label>

            <label className="sm-filter-field">
              <span>Maximum distance</span>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              >
                <option value="3">Within 3 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </label>

            <label className="sm-filter-field">
              <span>Food type</span>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              >
                <option>All Food Types</option>
                <option>Cooked Meals</option>
                <option>Vegetarian</option>
                <option>Bakery</option>
                <option>Packaged Food</option>
              </select>
            </label>

            <label className="sm-filter-field">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="score">Best match</option>
                <option value="distance">Nearest first</option>
              </select>
            </label>
          </div>
        </section>

        <section className="sm-results-section">
          <div className="sm-results-header">
            <div>
              <h2>NGO Recommendations</h2>
              <p>{filteredNgos.length} organizations match your filters</p>
            </div>
            <div className="sm-tabs">
              {["Recommended", "Requests Sent"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "selected" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Requests Sent" && sentRequests.length > 0 && (
                    <span className="sm-tab-count">{sentRequests.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="sm-ngo-list">
            {filteredNgos.map((ngo) => {
              const requestSent = sentRequests.includes(ngo.id);

              return (
                <article className="sm-ngo-card" key={ngo.id}>
                  <div className="sm-ngo-top">
                    <div className="sm-ngo-avatar">
                      <Building2 size={26} />
                    </div>

                    <div className="sm-ngo-identity">
                      <div className="sm-ngo-name-line">
                        <h3>{ngo.name}</h3>
                        {ngo.verified && (
                          <span className="sm-verified">
                            <CheckCircle2 size={14} /> Verified
                          </span>
                        )}
                      </div>
                      <span className="sm-ngo-type">{ngo.type}</span>
                      <span className="sm-ngo-location">
                        <MapPin size={14} /> {ngo.address}
                      </span>
                    </div>

                    <div className="sm-match-score">
                      <div className="sm-score-ring">
                        <strong>{ngo.score}%</strong>
                      </div>
                      <span>Match score</span>
                    </div>
                  </div>

                  <p className="sm-ngo-description">{ngo.description}</p>

                  <div className="sm-ngo-details">
                    <div>
                      <MapPin size={17} />
                      <span><strong>{ngo.distance} km</strong><small>Distance</small></span>
                    </div>
                    <div>
                      <Utensils size={17} />
                      <span><strong>{ngo.capacity}</strong><small>Meal capacity</small></span>
                    </div>
                    <div>
                      <Clock size={17} />
                      <span><strong>Flexible</strong><small>Pickup coordination</small></span>
                    </div>
                  </div>

                  <div className="sm-food-tags">
                    {ngo.foodTypes.map((type) => (
                      <span key={type}>{type}</span>
                    ))}
                  </div>

                  <div className="sm-ngo-footer">
                    <span className="sm-response-time">
                      <Clock size={14} /> {ngo.response}
                    </span>
                    <div className="sm-ngo-actions">
                      <button
                        className="sm-outline-btn"
                        onClick={() => setSelectedNgo(ngo)}
                      >
                        <Eye size={16} /> View Details
                      </button>
                      <button
                        className="sm-send-btn"
                        disabled={requestSent}
                        onClick={() => sendRequest(ngo)}
                      >
                        {requestSent ? (
                          <><CheckCircle2 size={16} /> Request Sent</>
                        ) : (
                          <><Send size={16} /> Send Request</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredNgos.length === 0 && (
              <div className="sm-empty-state">
                <Search size={35} />
                <h3>No matching NGOs found</h3>
                <p>Try increasing the distance or changing your food type filter.</p>
                <button
                  className="sm-outline-btn"
                  onClick={() => {
                    setSearch("");
                    setMaxDistance("10");
                    setFoodType("All Food Types");
                    setActiveTab("Recommended");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="sm-process-card">
          <div className="sm-process-icon"><HeartHandshake size={24} /></div>
          <div>
            <h3>How request matching works</h3>
            <p>
              In the intended workflow, requests are broadcast to eligible NGOs.
              The first NGO to accept claims the donation, tracking begins, and
              competing requests are closed. This page currently demonstrates
              the interface only; real acceptance requires backend coordination.
            </p>
          </div>
        </section>
      </main>

      {selectedNgo && (
        <div
          className="sm-modal-backdrop"
          onClick={() => setSelectedNgo(null)}
          role="presentation"
        >
          <section
            className="sm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sm-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="sm-modal-close"
              aria-label="Close details"
              onClick={() => setSelectedNgo(null)}
            >
              <X size={20} />
            </button>
            <div className="sm-modal-icon"><Building2 size={30} /></div>
            <h2 id="sm-modal-title">{selectedNgo.name}</h2>
            <p className="sm-modal-subtitle">{selectedNgo.type}</p>
            <div className="sm-modal-score">
              <Sparkles size={18} /> {selectedNgo.score}% sample match score
            </div>
            <p>{selectedNgo.description}</p>
            <div className="sm-modal-detail">
              <MapPin size={18} /><span>{selectedNgo.address} · {selectedNgo.distance} km away</span>
            </div>
            <div className="sm-modal-detail">
              <Utensils size={18} /><span>Capacity: {selectedNgo.capacity}</span>
            </div>
            <div className="sm-modal-detail">
              <Clock size={18} /><span>{selectedNgo.response}</span>
            </div>
            <div className="sm-food-tags">
              {selectedNgo.foodTypes.map((type) => <span key={type}>{type}</span>)}
            </div>
            <button
              className="sm-send-btn sm-modal-send"
              disabled={sentRequests.includes(selectedNgo.id)}
              onClick={() => sendRequest(selectedNgo)}
            >
              <Send size={17} />
              {sentRequests.includes(selectedNgo.id) ? "Request Already Sent" : "Send Donation Request"}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}