
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
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  Leaf,
  LockKeyhole,
  BadgeCheck,
} from "lucide-react";
import "./LicencesVerification.css";

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
    active: true,
  },
  { label: "Settings", icon: Settings, path: "/donor/settings" },
];

const documentTypes = [
  {
    id: "fssai",
    title: "FSSAI Licence",
    description: "Food Safety and Standards Authority of India licence.",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "registration",
    title: "Business Registration Certificate",
    description: "Certificate or document confirming business registration.",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "identity",
    title: "Owner / Authorized Person ID",
    description: "Supporting identification document, if requested.",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "other",
    title: "Additional Supporting Document",
    description: "Upload any other relevant supporting document.",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
];

const initialDocuments = {
  fssai: null,
  registration: null,
  identity: null,
  other: null,
};

export default function LicencesVerification() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(initialDocuments);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");

  const showNotice = (message, type = "info") => {
    setNotice(message);
    setNoticeType(type);
  };

  const handleUpload = (id, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      showNotice("Please upload a PDF, JPG, or PNG file.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotice("File size must be 5 MB or less.", "error");
      return;
    }

    setDocuments((current) => ({
      ...current,
      [id]: {
        file,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString(),
        status: "Ready to submit",
      },
    }));

    showNotice(
      `${file.name} is selected. Submit your documents for verification.`,
      "success",
    );
  };

  const handleRemove = (id) => {
    setDocuments((current) => ({
      ...current,
      [id]: null,
    }));
    showNotice("Selected document removed.", "info");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missing = documentTypes
      .filter((doc) => doc.required && !documents[doc.id])
      .map((doc) => doc.title);

    if (missing.length) {
      showNotice(
        `Please select the required documents: ${missing.join(", ")}.`,
        "error",
      );
      return;
    }

    showNotice(
      "Documents are selected and ready. Connect the verification API to submit them for review.",
      "success",
    );
  };

  const selectedCount = Object.values(documents).filter(Boolean).length;
  const requiredComplete = documentTypes
    .filter((doc) => doc.required)
    .every((doc) => documents[doc.id]);

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="lv-layout">
      <aside className="lv-sidebar">
        <div className="lv-brand">
          <div className="lv-brand-icon">
            <HeartHandshake size={29} />
          </div>
          <div>
            <h2>ANNORA</h2>
            <p>Food rescued. Hope restored.</p>
          </div>
        </div>

        <p className="lv-menu-label">DONOR MENU</p>

        <nav className="lv-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.label}
                className={`lv-nav-item ${item.active ? "active" : ""}`}
                onClick={() => item.path && navigate(item.path)}
                disabled={!item.path && !item.active}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="lv-sidebar-note">
          <Leaf size={25} />
          <strong>Every meal matters.</strong>
          <p>Help reduce food waste and nourish lives.</p>
        </div>
      </aside>

      <main className="lv-main">
        <header className="lv-header">
          <div>
            <p className="lv-eyebrow">ANNORA / DONOR PORTAL</p>
            <h1>Licences &amp; Verification</h1>
            <p className="lv-subtitle">
              Submit business documents to help establish donor credibility.
            </p>
          </div>

          <div className="lv-account">
            <div className="lv-account-icon">
              <Building2 size={22} />
            </div>
            <div>
              <strong>Your Business</strong>
              <span>Donor Account</span>
            </div>
            <span className="lv-account-dot" />
          </div>
        </header>

        <section className="lv-banner">
          <div className="lv-banner-icon">
            <ShieldCheck size={30} />
          </div>
          <div>
            <span>SAFE FOOD. TRUSTED DONORS.</span>
            <h2>Verify your business with ANNORA.</h2>
            <p>
              Provide the required documents so your business can be reviewed
              before verification is approved.
            </p>
          </div>
          <LockKeyhole className="lv-banner-decoration" size={80} />
        </section>

        <section className="lv-overview">
          <div className="lv-overview-card">
            <div className="lv-overview-icon lv-green">
              <FileText size={22} />
            </div>
            <div>
              <span>Documents Selected</span>
              <strong>{selectedCount} / {documentTypes.length}</strong>
            </div>
          </div>

          <div className="lv-overview-card">
            <div className="lv-overview-icon lv-purple">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span>Required Documents</span>
              <strong>{requiredComplete ? "Complete" : "Pending"}</strong>
            </div>
          </div>

          <div className="lv-overview-card">
            <div className="lv-overview-icon lv-orange">
              <Clock size={22} />
            </div>
            <div>
              <span>Verification Status</span>
              <strong>Not submitted</strong>
            </div>
          </div>
        </section>

        {notice && (
          <div
            className={`lv-notice lv-notice-${noticeType}`}
            role="status"
          >
            {noticeType === "error" ? (
              <AlertCircle size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <section className="lv-card">
            <div className="lv-section-heading">
              <div>
                <h2>Required Business Documents</h2>
                <p>
                  PDF, JPG or PNG · Maximum file size 5 MB per document
                </p>
              </div>
              <span className="lv-required-label">* Required</span>
            </div>

            <div className="lv-document-list">
              {documentTypes.map((doc) => {
                const selected = documents[doc.id];

                return (
                  <article className="lv-document-row" key={doc.id}>
                    <div className="lv-document-icon">
                      <FileText size={25} />
                    </div>

                    <div className="lv-document-info">
                      <div className="lv-document-title">
                        <h3>{doc.title}</h3>
                        {doc.required && (
                          <span className="lv-required-star">*</span>
                        )}
                      </div>

                      <p>{doc.description}</p>

                      {selected ? (
                        <div className="lv-file-details">
                          <CheckCircle2 size={15} />
                          <span>{selected.name}</span>
                          <small>{formatSize(selected.size)}</small>
                        </div>
                      ) : (
                        <span className="lv-not-uploaded">
                          <Clock size={13} />
                          Not selected
                        </span>
                      )}
                    </div>

                    <div className="lv-document-actions">
                      {selected && (
                        <>
                          <span className="lv-ready-badge">
                            <CheckCircle2 size={13} />
                            Ready
                          </span>
                          <button
                            type="button"
                            className="lv-icon-button"
                            onClick={() => handleRemove(doc.id)}
                            aria-label={`Remove ${doc.title}`}
                            title="Remove document"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}

                      <label className="lv-upload-button">
                        <Upload size={16} />
                        {selected ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept={doc.accept}
                          onChange={(event) => handleUpload(doc.id, event)}
                          hidden
                        />
                      </label>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="lv-upload-tip">
              <AlertCircle size={18} />
              <p>
                Ensure that documents are clear, readable, and valid. Do not
                upload passwords or unrelated sensitive information. Actual
                verification requires review by your platform administrator.
              </p>
            </div>
          </section>

          <section className="lv-card lv-review-card">
            <div className="lv-review-icon">
              <BadgeCheck size={27} />
            </div>
            <div className="lv-review-copy">
              <h3>Ready for verification?</h3>
              <p>
                Once required documents are selected, submit them to begin
                the review process. Selection alone does not mean your
                business is verified.
              </p>
            </div>
            <button
              type="submit"
              className="lv-submit-button"
              disabled={!requiredComplete}
            >
              <ShieldCheck size={17} />
              Submit for Review
            </button>
          </section>
        </form>

        <footer className="lv-footer">
          <HeartHandshake size={17} />
          ANNORA — Where Every Meal Finds Meaning.
        </footer>
      </main>
    </div>
  );
}
