import { useState } from "react";
import {
  Leaf,
  ArrowRight,
  Heart,
  UsersRound,
  Utensils,
  HandHeart,
  ShieldCheck,
  Menu,
  X,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ChevronLeft,
  Sprout,
} from "lucide-react";

import "../index.css";
import "./LandingPage.css";

const API_URL = "http://localhost:5000";

function Logo() {
  return (
    <a href="#home" className="annora-logo">
      <span className="annora-logo-icon">
        <Leaf size={25} />
      </span>
      <span className="annora-logo-text">
        ANNORA
        <small>Where Every Meal Finds Meaning</small>
      </span>
    </a>
  );
}

export function LandingPage({ onLogin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="annora-landing">
      <header className="annora-header">
        <div className="annora-container annora-nav">
          <Logo />

          <button
            className="annora-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav
            className={
              menuOpen
                ? "annora-nav-links is-open"
                : "annora-nav-links"
            }
          >
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About Us
            </a>
            <a href="#how" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
            <button
              className="annora-nav-login"
              onClick={() => {
                setMenuOpen(false);
                onLogin();
              }}
            >
              Login <ArrowRight size={17} />
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="annora-hero" id="home">
          <div className="annora-container annora-hero-grid">
            <div className="annora-hero-content">
              <span className="annora-eyebrow">
                <Sprout size={17} /> FOOD WASTE TO FOOD HOPE
              </span>

              <h1>
                Every Meal Can
                <span> Make a Difference.</span>
              </h1>

              <p>
                Connecting surplus food with people who need it.
                Together, we can reduce food waste and build a world
                where no one goes hungry.
              </p>

              <div className="annora-hero-actions">
                <button
                  className="annora-primary-button"
                  onClick={onLogin}
                >
                  Get Started <ArrowRight size={19} />
                </button>

                <a
                  className="annora-secondary-button"
                  href="#about"
                >
                  Discover Our Mission
                </a>
              </div>

              <div className="annora-trust-row">
                <span>
                  <ShieldCheck size={19} /> Community driven
                </span>
                <span>
                  <Heart size={19} /> Impact focused
                </span>
              </div>
            </div>

            <div className="annora-hero-visual">
              <div className="annora-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
                  alt="A fresh, nourishing meal prepared for sharing"
                />

                <div className="annora-image-label">
                  <span className="annora-label-icon">
                    <Heart size={21} />
                  </span>
                  <span>
                    <strong>Share More. Waste Less.</strong>
                    <small>
                      Small actions, meaningful impact.
                    </small>
                  </span>
                </div>
              </div>

              <div className="annora-floating-leaf">
                <Leaf size={34} />
              </div>
            </div>
          </div>
        </section>

        <section className="annora-impact" id="about">
          <div className="annora-container">
            <div className="annora-section-heading">
              <span className="annora-eyebrow">OUR PURPOSE</span>
              <h2>A better future starts with sharing.</h2>
              <p>
                Good food should nourish people, not go to waste.
                ANNORA helps communities turn surplus into support.
              </p>
            </div>

            <div className="annora-feature-grid">
              <article className="annora-feature-card">
                <span className="annora-feature-icon annora-icon-green">
                  <Utensils size={25} />
                </span>
                <h3>Rescue Food</h3>
                <p>
                  Help redirect surplus meals and fresh food away
                  from landfills and toward people.
                </p>
              </article>

              <article className="annora-feature-card">
                <span className="annora-feature-icon annora-icon-peach">
                  <HandHeart size={25} />
                </span>
                <h3>Share With Care</h3>
                <p>
                  Connect food donors with communities and
                  organizations that can put food to good use.
                </p>
              </article>

              <article className="annora-feature-card">
                <span className="annora-feature-icon annora-icon-yellow">
                  <UsersRound size={25} />
                </span>
                <h3>Build Community</h3>
                <p>
                  Bring people together around a shared mission
                  of compassion, sustainability and dignity.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="annora-how" id="how">
          <div className="annora-container annora-how-content">
            <div>
              <span className="annora-eyebrow">
                SIMPLE STEPS, REAL IMPACT
              </span>
              <h2>Food has value. Let’s pass it on.</h2>
              <p>
                Whether you are donating food, coordinating a
                community initiative or supporting distribution,
                every contribution matters.
              </p>
            </div>

            <button
              className="annora-primary-button"
              onClick={onLogin}
            >
              Join ANNORA <ArrowRight size={19} />
            </button>
          </div>
        </section>
      </main>

      <footer className="annora-footer">
        <div className="annora-container annora-footer-content">
          <Logo />
          <p>Where Every Meal Finds Meaning.</p>
          <span>© {new Date().getFullYear()} ANNORA</span>
        </div>
      </footer>
    </div>
  );
}

export function LoginPage({ onBack, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RESTAURANT");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode() {
    setIsRegistering((previous) => !previous);
    setMessage("");
    setPassword("");
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (isRegistering && !name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!normalizedEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (isRegistering && password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (isRegistering && !registrationNumber.trim()) {
      setMessage(
        role === "RESTAURANT"
          ? "Please enter your FSSAI registration/licence number."
          : "Please enter your NGO registration/licence number."
      );
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role,
            registrationNumber: registrationNumber.trim(),
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Registration failed.");
        }

        setMessage(
          data.message ||
            "Registration successful! Please wait for admin approval."
        );

        setName("");
        setEmail("");
        setPassword("");
        setRegistrationNumber("");
        setRole("RESTAURANT");
        setIsRegistering(false);
      } else {
        // Existing admin login endpoint remains unchanged.
        const response = await fetch(`${API_URL}/api/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username:
              normalizedEmail === "admin@foodbridge.demo"
                ? "admin"
                : normalizedEmail,
            password,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Login failed. Please check your credentials."
          );
        }

        if (onLoginSuccess) {
          onLoginSuccess(data.admin);
        } else {
          setMessage(
            "Login successful, but no dashboard callback is configured yet."
          );
        }
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage(
          "Cannot connect to ANNORA server. Make sure the backend is running on port 5000."
        );
      } else {
        setMessage(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="annora-login">
      <div className="annora-login-left">
        <button
          className="annora-back-button"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft size={19} /> Back to home
        </button>

        <div className="annora-login-brand">
          <Logo />
        </div>

        <div className="annora-login-message">
          <span className="annora-eyebrow">
            <Leaf size={17} /> GOOD FOOD. GREATER GOOD.
          </span>

          <h1>
            Together, we can make
            <span> every meal matter.</span>
          </h1>

          <p>
            Join a community turning surplus food into nourishment,
            opportunity and hope.
          </p>

          <div className="annora-login-points">
            <span>
              <ShieldCheck size={20} /> A community built on trust
            </span>
            <span>
              <Heart size={20} /> Every contribution counts
            </span>
          </div>
        </div>

        <div className="annora-login-bottom">
          Where Every Meal Finds Meaning.
        </div>
      </div>

      <div className="annora-login-right">
        <div className="annora-login-card">
          <div className="annora-mobile-logo">
            <Logo />
          </div>

          <span className="annora-eyebrow">WELCOME TO ANNORA</span>

          <h2>{isRegistering ? "Create your account" : "Welcome back!"}</h2>

          <p className="annora-login-subtitle">
            {isRegistering
              ? "Join ANNORA and help make a difference."
              : "Sign in to continue making a difference."}
          </p>

          <form onSubmit={handleSubmit} className="annora-login-form">
            {isRegistering && (
              <>
                <label htmlFor="annora-name">Full name</label>

                <div className="annora-input-wrapper">
                  <UsersRound size={19} />
                  <input
                    id="annora-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <label htmlFor="annora-role">Account type</label>

                <div className="annora-input-wrapper">
                  <HandHeart size={19} />
                  <select
                    id="annora-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    required
                  >
                    <option value="RESTAURANT">Donor</option>
                    <option value="NGO">NGO</option>
                  </select>
                </div>
              </>
            )}

            <label htmlFor="annora-email">Email address</label>

            <div className="annora-input-wrapper">
              <Mail size={19} />
              <input
                id="annora-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {isRegistering && (
              <>
                <label htmlFor="annora-registration-number">
                  {role === "RESTAURANT"
                    ? "FSSAI Registration/Licence Number"
                    : "NGO Registration/Licence Number"}
                </label>

                <div className="annora-input-wrapper">
                  <ShieldCheck size={19} />
                  <input
                    id="annora-registration-number"
                    type="text"
                    placeholder={
                      role === "RESTAURANT"
                        ? "Enter FSSAI number"
                        : "Enter NGO registration number"
                    }
                    value={registrationNumber}
                    onChange={(event) =>
                      setRegistrationNumber(event.target.value)
                    }
                    required
                  />
                </div>
              </>
            )}

            <label htmlFor="annora-password">Password</label>

            <div className="annora-input-wrapper">
              <LockKeyhole size={19} />
              <input
                id="annora-password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isRegistering
                    ? "Create a password (min. 8 characters)"
                    : "Enter your password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  isRegistering ? "new-password" : "current-password"
                }
                minLength={isRegistering ? 8 : undefined}
                required
              />

              <button
                type="button"
                className="annora-password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            {!isRegistering && (
              <div className="annora-login-options">
                <label className="annora-remember">
                  <input type="checkbox" /> Remember me
                </label>

                <button
                  type="button"
                  className="annora-text-button"
                  onClick={() =>
                    setMessage(
                      "Password reset is not configured on the backend yet."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="annora-primary-button annora-submit"
              disabled={loading}
            >
              {loading
                ? isRegistering
                  ? "Creating account..."
                  : "Signing in..."
                : isRegistering
                  ? "Create Account"
                  : "Sign In"}

              {!loading && <ArrowRight size={19} />}
            </button>

            {message && (
              <p
                className="annora-login-message-note"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            )}
          </form>

          <div className="annora-login-divider">
            <span>OR</span>
          </div>

          <p className="annora-login-footer">
            {isRegistering ? "Already registered?" : "New to ANNORA?"}{" "}
            <button
              type="button"
              className="annora-text-button"
              onClick={switchMode}
            >
              {isRegistering ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
