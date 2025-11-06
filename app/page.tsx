'use client';

import { useEffect, useState } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700']
});

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Set target date to November 10th, 2025 at 8:00 AM
    const targetDate = new Date('2025-11-10T08:00:00');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Intersection Observer for reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setTimeout(() => {
      setEmailSubmitted(false);
      (e.target as HTMLFormElement).reset();
    }, 3000);
  };

  return (
    <div className={`printorchestra-container ${inter.variable} ${spaceGrotesk.variable}`}>
      {/* Animated background particles */}
      <div className="particle-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Main veil overlay */}
      <div className="veil-overlay"></div>
      
      {/* Spotlight effect */}
      <div 
        className="spotlight"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 200, 255, 0.1) 0%, transparent 25%)`
        }}
      ></div>

      {/* Header */}
      <header className="main-header">
        <div className="logo-container">
          <span className="logo-text">print<span className="logo-accent">Orchestra</span></span>
          <span className="logo-tagline">AUTONOMOUS CREATION</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-container">
        {/* Glitch text effect */}
        <div className="glitch-container">
          <h1 className="glitch-text" data-text="REDEFINING">REDEFINING</h1>
          <h1 className="glitch-text" data-text="AUTOMATION">AUTOMATION</h1>
        </div>

        {/* Product reveal section */}
        <div className="product-reveal">
          <div className="product-veil">
            <div className="veil-fabric"></div>
            <div className="product-silhouette">
              {/* Mysterious product outline with partial reveals */}
              <div className="reveal-section arm-hint">
                <div className="reveal-glow"></div>
                <span className="feature-hint">ROBOTIC ARM</span>
              </div>
              <div className="reveal-section printer-hint">
                <div className="reveal-glow"></div>
                <span className="feature-hint">RESIN CHAMBER</span>
              </div>
              <div className="reveal-section system-hint">
                <div className="reveal-glow"></div>
                <span className="feature-hint">AI CONTROL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature teaser */}
        <div className="features-grid">
          <div className="feature-card" data-reveal="1">
            <div className="feature-icon">◈</div>
            <h3>Autonomous Refill</h3>
            <p>Never interrupt your workflow</p>
          </div>
          <div className="feature-card" data-reveal="2">
            <div className="feature-icon">◉</div>
            <h3>Self-Cleaning</h3>
            <p>Pristine prints, every time</p>
          </div>
          <div className="feature-card" data-reveal="3">
            <div className="feature-icon">◊</div>
            <h3>Intelligent Curing</h3>
            <p>Perfection, automated</p>
          </div>
          <div className="feature-card" data-reveal="4">
            <div className="feature-icon">◆</div>
            <h3>24/7 Operation</h3>
            <p>Production that never sleeps</p>
          </div>
        </div>

        {/* Coming soon section */}
        <div className="coming-soon">
          <div className="countdown-label">UNVEILING IN</div>
          <div className="countdown-container">
            <div className="countdown-item">
              <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="countdown-unit">DAYS</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="countdown-unit">HOURS</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="countdown-unit">MINUTES</span>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="countdown-unit">SECONDS</span>
            </div>
          </div>
        </div>

        {/* Email signup */}
        <div className="notify-section">
          <p className="notify-text">Be the first to witness the revolution</p>
          <form className="notify-form" onSubmit={handleEmailSubmit}>
            <input type="email" placeholder="Enter your email" className="email-input" required />
            <button 
              type="submit" 
              className="notify-button"
              style={emailSubmitted ? { background: 'linear-gradient(135deg, #00ff88, #00cc66)' } : {}}
            >
              <span>{emailSubmitted ? 'SUBSCRIBED ✓' : 'GET NOTIFIED'}</span>
              <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Teaser text */}
        <div className="teaser-text">
          <p>The first fully autonomous desktop resin printer.</p>
          <p>Where precision meets perpetual motion.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <span>© 2025 printOrchestra.</span>
          <span className="separator">|</span>
          <span>Engineering Tomorrow</span>
        </div>
      </footer>
    </div>
  );
}