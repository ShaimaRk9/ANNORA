import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard, Users, UserRound, HandHeart, ShieldCheck,
  ChartNoAxesColumn, Settings, LogOut, Search, Bell, ChevronDown,
  ChevronRight, ClipboardCheck, FileText, Building2, Clock, ArrowUpRight,
  Leaf, Menu, X, Plus, RefreshCw,
} from "lucide-react";
import "./AdminDashboard.css";

const API = "http://localhost:5000/api/admin";
const menu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Donors", icon: UserRound },
  { label: "Receivers (NGOs)", icon: Users },
  { label: "Food Safety Reviews", icon: ShieldCheck },
  { label: "Users Management", icon: Users },
  { label: "Reports & Analytics", icon: ChartNoAxesColumn },
  { label: "Settings", icon: Settings },
];
const moneyFreeStats = [
  { key: "totalDonors", title: "Total Donors", icon: Users, color: "#15976e" },
  { key: "totalReceivers", title: "Total Receivers (NGOs)", icon: Building2, color: "#169bb8" },
  { key: "totalPending", title: "Pending Approvals", icon: Clock, color: "#efa91d" },
  { key: "registeredUsers", title: "Registered Users", icon: UserRound, color: "#8750df" },
];
function StatCard({ title, value, icon: Icon, color }) {
  return <div className="ann-stat-card"><div className="ann-stat-icon" style={{ background: color }}><Icon size={23} /></div><div className="ann-stat-content"><span>{title}</span><strong>{value}</strong><small><ArrowUpRight size={14} /> Live database count</small></div></div>;
}
function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function roleLabel(role) { return ({ RESTAURANT: "Donor", NGO: "NGO", RECEIVER: "Receiver", VOLUNTEER: "Volunteer" })[role] || role || "User"; }
function statusColor(status) { return status === "APPROVED" || status === "RESOLVED" ? "#13815d" : status === "REJECTED" ? "#cf5e5e" : "#a87508"; }

export default function AdminDashboard({ admin, onLogout }) {
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [stats, setStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState({ name: admin?.name || "", email: admin?.email || "", username: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [reviewForm, setReviewForm] = useState({ title: "", organization: "", details: "" });
  const [reviewNotes, setReviewNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, { credentials: "include", ...options, headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || (response.status === 401 ? "Admin session expired. Please log in again." : "Request failed. Please try again."));
    return data;
  }, []);

  const loadDashboard = useCallback(async () => {
    const data = await request("/dashboard");
    setStats(data.stats || {});
    setPendingUsers(Array.isArray(data.pendingUsers) ? data.pendingUsers : []);
  }, [request]);
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const query = active === "Donors" ? "?role=RESTAURANT" : active === "Receivers (NGOs)" ? "?role=NGO" : "";
      const data = await request(`/users${query}`);
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) { setError(err.message); setUsers([]); }
    finally { setUsersLoading(false); }
  }, [active, request]);
  const loadReviews = useCallback(async () => {
    try { const data = await request("/safety-reviews"); setReviews(Array.isArray(data.reviews) ? data.reviews : []); }
    catch (err) { setError(err.message); }
  }, [request]);
  const loadProfile = useCallback(async () => {
    try { const data = await request("/me"); if (data.admin) setProfile({ name: data.admin.name || "", email: data.admin.email || "", username: data.admin.username || "" }); }
    catch (err) { setError(err.message); }
  }, [request]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError("");
      try {
        const data = await request("/dashboard");
        if (!cancelled) { setStats(data.stats || {}); setPendingUsers(Array.isArray(data.pendingUsers) ? data.pendingUsers : []); }
      } catch (err) { if (!cancelled) setError(err.message); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [request]);
  useEffect(() => { if (["Donors", "Receivers (NGOs)", "Users Management"].includes(active)) loadUsers(); }, [active, loadUsers]);
  useEffect(() => { if (active === "Food Safety Reviews") loadReviews(); }, [active, loadReviews]);
  useEffect(() => { if (active === "Settings") loadProfile(); }, [active, loadProfile]);

  async function refreshData() {
    setError("");
    try { await loadDashboard(); if (["Donors", "Receivers (NGOs)", "Users Management"].includes(active)) await loadUsers(); if (active === "Food Safety Reviews") await loadReviews(); setSuccess("Data refreshed."); }
    catch (err) { setError(err.message); }
  }
  async function handleDecision(user, decision) {
    const id = user._id || user.id;
    if (!id || busyId) return;
    setBusyId(id); setError(""); setSuccess("");
    try {
      const data = await request(`/users/${encodeURIComponent(id)}/${decision}`, { method: "PATCH", ...(decision === "reject" ? { body: JSON.stringify({ rejectionReason: "Rejected by admin." }) } : {}) });
      setSuccess(data.message || `Registration ${decision}d.`); await loadDashboard(); await loadUsers();
    } catch (err) { setError(err.message); }
    finally { setBusyId(""); }
  }
  function chooseMenu(label) { setActive(label); setSearch(""); setError(""); setSuccess(""); setMobileMenu(false); }
  async function createReview(event) {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try { const data = await request("/safety-reviews", { method: "POST", body: JSON.stringify(reviewForm) }); setReviews((old) => [data.review, ...old]); setReviewForm({ title: "", organization: "", details: "" }); setSuccess(data.message); await loadDashboard(); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  async function updateReview(review, status) {
    setBusyId(review._id); setError(""); setSuccess("");
    try { const data = await request(`/safety-reviews/${review._id}`, { method: "PATCH", body: JSON.stringify({ status, notes: reviewNotes[review._id] ?? review.notes ?? "" }) }); setReviews((old) => old.map((item) => item._id === review._id ? data.review : item)); setSuccess(data.message); await loadDashboard(); }
    catch (err) { setError(err.message); }
    finally { setBusyId(""); }
  }
  async function saveSettings(event) {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try {
      const body = { ...profile, ...passwords };
      const data = await request("/settings", { method: "PATCH", body: JSON.stringify(body) });
      if (data.admin) setProfile({ name: data.admin.name || "", email: data.admin.email || "", username: data.admin.username || "" });
      setPasswords({ currentPassword: "", newPassword: "" }); setSuccess(data.message);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  const query = search.trim().toLowerCase();
  const visibleApprovals = pendingUsers.filter((user) => [user.name, user.email, user.role, user.registrationNumber].filter(Boolean).join(" ").toLowerCase().includes(query));
  const visibleUsers = users.filter((user) => [user.name, user.email, user.role, user.registrationNumber, user.verificationStatus].filter(Boolean).join(" ").toLowerCase().includes(query));
  const visibleReviews = reviews.filter((review) => [review.title, review.organization, review.details, review.status].filter(Boolean).join(" ").toLowerCase().includes(query));

  return <div className="ann-dashboard">
    {mobileMenu && <button className="ann-mobile-overlay" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}
    <aside className={`ann-sidebar ${mobileMenu ? "ann-sidebar-open" : ""}`}>
      <div className="ann-brand"><div className="ann-brand-mark"><Leaf size={25} /></div><div><strong>ANNORA</strong><small>Good Food. Greater Impact.</small></div><button className="ann-close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X /></button></div>
      <nav className="ann-nav">{menu.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "active" : ""} onClick={() => chooseMenu(label)}><Icon size={18} /><span>{label}</span></button>)}</nav>
      <button className="ann-logout" onClick={onLogout}><LogOut size={18} /> Logout</button>
    </aside>
    <main className="ann-main">
      <header className="ann-page-heading"><button className="ann-mobile-toggle" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu /></button><div><h1>{active === "Dashboard" ? "Admin Dashboard" : active}</h1><p>Manage users, review food safety and monitor platform activity.</p></div></header>
      <div className="ann-workspace">
        <header className="ann-topbar"><div className="ann-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, title..." />{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</div><div className="ann-profile"><div className="ann-avatar">{(profile.name || admin?.name || "Admin").charAt(0).toUpperCase()}</div><div className="ann-profile-text"><strong>{profile.name || admin?.name || "Admin"}</strong><span>Super Admin</span></div><ChevronDown size={15} /></div></header>
        <div className="ann-content">
          {error && <div role="alert" style={{ padding: "10px 12px", marginBottom: 12, borderRadius: 7, background: "#fff0f0", color: "#b42323" }}>{error}</div>}
          {success && <div role="status" style={{ padding: "10px 12px", marginBottom: 12, borderRadius: 7, background: "#e7f5ef", color: "#075342" }}>{success}</div>}
          {active === "Dashboard" && <>
            <section className="ann-stat-grid">{moneyFreeStats.map(({ key, title, icon, color }) => <StatCard key={key} title={title} value={loading ? "…" : (stats[key] ?? 0).toLocaleString("en-IN")} icon={icon} color={color} />)}</section>
            <p className="ann-api-note">Counts are loaded from MongoDB. Donation statistics are not included because donation records are not connected.</p>
            <section className="ann-analytics-grid">
              <article className="ann-panel"><h2>Donation Trend</h2><div className="ann-section-placeholder"><p>Donation trend will be available when donation records are added.</p></div></article>
              <article className="ann-panel"><h2>Food Category Distribution</h2><div className="ann-section-placeholder"><p>Category statistics require donation records.</p></div></article>
              <article className="ann-panel ann-activity-panel"><h2>Platform Summary</h2><p className="ann-api-note">Approved donors: {stats.approvedDonors ?? 0} · Approved NGOs: {stats.approvedReceivers ?? 0} · Rejected registrations: {(stats.rejectedDonors ?? 0) + (stats.rejectedReceivers ?? 0)}</p></article>
              <article className="ann-panel ann-approvals-panel"><div className="ann-panel-title"><h2>Pending Approvals</h2><button onClick={() => chooseMenu("Users Management")}>View Users</button></div><div className="ann-table-wrap"><table className="ann-approval-table"><thead><tr><th>Type</th><th>Name</th><th>Email</th><th>Registration No.</th><th>Submitted On</th><th>Action</th></tr></thead><tbody>{visibleApprovals.map((user) => { const id = user._id || user.id; return <tr key={id}><td><span className="ann-type"><ClipboardCheck size={15} />{roleLabel(user.role)}</span></td><td>{user.name || "—"}</td><td>{user.email || "—"}</td><td>{user.registrationNumber || "—"}</td><td>{formatDate(user.createdAt)}</td><td><div className="ann-row-actions"><button className="ann-verify" disabled={Boolean(busyId)} onClick={() => handleDecision(user, "approve")}>{busyId === id ? "Saving…" : "Approve"}</button><button className="ann-reject" disabled={Boolean(busyId)} onClick={() => handleDecision(user, "reject")}>Reject</button></div></td></tr>; })}{!loading && visibleApprovals.length === 0 && <tr><td colSpan="6">{query ? "No matching pending registrations." : "No pending registrations."}</td></tr>}{loading && <tr><td colSpan="6">Loading approvals…</td></tr>}</tbody></table></div></article>
              <article className="ann-panel ann-quick-panel"><h2>Quick Actions</h2>{[[ShieldCheck, "Food Safety Reviews", "Create and update review records", "Food Safety Reviews"], [Users, "Manage Users", "View registered Donors and NGOs", "Users Management"], [FileText, "Generate Reports", "View live database summaries", "Reports & Analytics"], [Settings, "Platform Settings", "Update admin profile and password", "Settings"]].map(([Icon, title, subtitle, target]) => <button className="ann-quick-action" key={title} onClick={() => chooseMenu(target)}><span><Icon size={18} /></span><div><strong>{title}</strong><small>{subtitle}</small></div><ChevronRight size={17} /></button>)}</article>
            </section>
          </>}
          {["Donors", "Receivers (NGOs)", "Users Management"].includes(active) && <section className="ann-panel"><div className="ann-panel-title"><h2>{active === "Donors" ? "Registered Donors" : active === "Receivers (NGOs)" ? "Registered NGOs" : "All Registered Users"}</h2><button onClick={refreshData} disabled={usersLoading}><RefreshCw size={14} /> {usersLoading ? "Refreshing…" : "Refresh"}</button></div><p className="ann-api-note">{visibleUsers.length} matching account(s)</p><div className="ann-table-wrap"><table className="ann-approval-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registration No.</th><th>Status</th><th>Registered On</th></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user._id || user.id}><td>{user.name || "—"}</td><td>{user.email || "—"}</td><td>{roleLabel(user.role)}</td><td>{user.registrationNumber || "—"}</td><td><strong style={{ color: statusColor(user.verificationStatus) }}>{user.verificationStatus || "UNKNOWN"}</strong></td><td>{formatDate(user.createdAt)}</td></tr>)}{usersLoading && <tr><td colSpan="6">Loading users…</td></tr>}{!usersLoading && visibleUsers.length === 0 && <tr><td colSpan="6">{query ? "No matching users." : "No registered users found."}</td></tr>}</tbody></table></div></section>}
          {active === "Food Safety Reviews" && <div className="ann-analytics-grid"><section className="ann-panel"><h2><Plus size={18} /> Create Food Safety Review</h2><form onSubmit={createReview} style={{ display: "grid", gap: 12, marginTop: 16 }}><label>Review title<input required maxLength={120} value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="e.g. Food packaging concern" /></label><label>Donor / organization (optional)<input value={reviewForm.organization} onChange={(e) => setReviewForm({ ...reviewForm, organization: e.target.value })} placeholder="Organization name" /></label><label>Details<textarea required maxLength={2000} rows={4} value={reviewForm.details} onChange={(e) => setReviewForm({ ...reviewForm, details: e.target.value })} placeholder="Describe the food safety issue or review" /></label><button className="ann-verify" type="submit" disabled={saving}>{saving ? "Saving…" : "Create Review"}</button></form></section><section className="ann-panel"><div className="ann-panel-title"><h2>Saved Reviews ({visibleReviews.length})</h2><button onClick={loadReviews}>Refresh</button></div>{visibleReviews.map((review) => <article key={review._id} style={{ borderBottom: "1px solid #e7ece9", padding: "14px 0", display: "grid", gap: 8 }}><strong>{review.title}</strong><small>{review.organization || "Organization not specified"} · {formatDate(review.createdAt)}</small><p>{review.details}</p><label>Admin notes<textarea rows={2} value={reviewNotes[review._id] ?? review.notes ?? ""} onChange={(e) => setReviewNotes({ ...reviewNotes, [review._id]: e.target.value })} placeholder="Add review notes" /></label><div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}><strong style={{ color: statusColor(review.status) }}>{review.status.replace("_", " ")}</strong><button disabled={busyId === review._id} onClick={() => updateReview(review, "OPEN")}>Open</button><button disabled={busyId === review._id} onClick={() => updateReview(review, "IN_REVIEW")}>In review</button><button className="ann-verify" disabled={busyId === review._id} onClick={() => updateReview(review, "RESOLVED")}>Resolve & Save</button></div></article>)}{visibleReviews.length === 0 && <p className="ann-api-note">No reviews yet. Create a review using the form.</p>}</section></div>}
          {active === "Reports & Analytics" && <section className="ann-panel"><div className="ann-panel-title"><h2>Reports & Analytics</h2><button onClick={refreshData}>Refresh Reports</button></div><div className="ann-stat-grid">{[["Total Donors", "totalDonors"], ["Total NGOs", "totalReceivers"], ["Registered Users", "registeredUsers"], ["Pending Approvals", "totalPending"], ["Approved Donors", "approvedDonors"], ["Approved NGOs", "approvedReceivers"], ["Pending Donors", "pendingDonors"], ["Pending NGOs", "pendingReceivers"], ["Rejected Donors", "rejectedDonors"], ["Rejected NGOs", "rejectedReceivers"], ["Safety Reviews", "safetyReviews"]].map(([label, key]) => <div className="ann-stat-card" key={key}><div className="ann-stat-content"><span>{label}</span><strong>{stats[key] ?? 0}</strong><small>Live database count</small></div></div>)}</div><p className="ann-api-note">These are current database counts, not historical trends. Donation and meals-saved reports are unavailable until donation records exist.</p></section>}
          {active === "Settings" && <section className="ann-panel"><h2>Admin Settings</h2><p className="ann-api-note">Update your admin profile and optionally change your password. Password changes require your current password.</p><form onSubmit={saveSettings} style={{ display: "grid", gap: 14, maxWidth: 560, marginTop: 18 }}><label>Admin name<input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label>Admin email<input type="email" required value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label><label>Admin username<input required value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} /></label><hr /><h3>Change Password (optional)</h3><label>Current password<input type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label><label>New password (minimum 8 characters)<input type="password" autoComplete="new-password" minLength={8} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label><button className="ann-verify" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</button></form><p className="ann-api-note">If you change your username or password, use the new credentials at your next login. Keep your .env file private.</p></section>}
        </div>
      </div>
    </main>
  </div>;
}
