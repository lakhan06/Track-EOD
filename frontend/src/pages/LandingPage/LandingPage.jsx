import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Track EOD Efficiently</h1>
          <p>
            Simplify your employee reporting process with our advanced
            platform. Empower your team, boost productivity, and stay informed.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/LandingPageImages/WhatsApp Image 2024-12-02 at 21.41.12_c6ce02e5.jpg" alt="Track EOD Hero" />
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do">
        <h2>What We Do</h2>
        <div className="features">
          <div className="feature">
            <img src="/images/LandingPageImages/WhatsApp Image 2024-12-02 at 21.41.12_c6ce02e5.jpg" alt="Feature 1" />
            <h3>Streamlined EOD Submissions</h3>
            <p>
              Simplify end-of-day reporting for your team with an intuitive
              interface and robust tools.
            </p>
          </div>
          <div className="feature">
            <img src="/images/LandingPageImages/WhatsApp Image 2024-12-02 at 21.41.12_c6ce02e5.jpg" alt="Feature 2" />
            <h3>Real-Time Notifications</h3>
            <p>
              Stay informed with instant notifications about updates, feedback,
              and task assignments.
            </p>
          </div>
          <div className="feature">
            <img src="/images/LandingPageImages/WhatsApp Image 2024-12-02 at 21.41.12_c6ce02e5.jpg" alt="Feature 3" />
            <h3>Advanced Analytics</h3>
            <p>
              Analyze performance trends and enhance decision-making with
              comprehensive dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service">
            <h3>Task Management</h3>
            <p>
              Assign, track, and manage tasks seamlessly to enhance team
              collaboration.
            </p>
          </div>
          <div className="service">
            <h3>EOD Tracking</h3>
            <p>
              Enable employees to report daily activities efficiently and
              receive actionable feedback.
            </p>
          </div>
          <div className="service">
            <h3>Notifications</h3>
            <p>
              Keep everyone in the loop with real-time alerts for critical
              updates.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <h2>Pricing</h2>
        <div className="pricing-options">
          <div className="pricing-plan">
            <h3>Basic</h3>
            <p>For small teams and startups</p>
            <p className="price">$10/month</p>
            <Link to="/register" className="price-btn">
              Get Started
            </Link>
          </div>
          <div className="pricing-plan premium">
            <h3>Pro</h3>
            <p>For growing businesses</p>
            <p className="price">$30/month</p>
            <Link to="/register" className="price-btn">
              Get Started
            </Link>
          </div>
          <div className="pricing-plan">
            <h3>Enterprise</h3>
            <p>Custom solutions for large teams</p>
            <p className="price">Contact Us</p>
            <Link to="/register" className="price-btn">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Form Section */}
      {/* <section className="demo-form">
        <h2>Request a Demo</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="4"
              placeholder="Describe your requirements"
            ></textarea>
          </div>
          <button type="submit" className="price-btn">
            Submit
          </button>
        </form>
      </section> */}
    </div>
  );
};

export default LandingPage;
