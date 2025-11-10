'use client';

import { useEffect, useState } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import Carousel from '@/components/Carousel';

const UNOPTIMIZED = process.env.NODE_ENV !== 'production';

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
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [inGallery, setInGallery] = useState(false);

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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  useEffect(() => {
    // Scroll-based active section detection
    const handleScroll = () => {
      const sections = document.querySelectorAll('#option1, #option2, #option3');
      let currentActive = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Section is active when visible in viewport, aligned with scroll-margin-top (120px)
        if (rect.top <= 200 && rect.bottom >= 300) {
          currentActive = section.id;
        }
      });

      setActiveSection(currentActive);
    };

    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Compute gallery visibility: hide only after the Galerie heading scrolls past the header
    const computeGalleryVisibility = () => {
      const headerEl = document.querySelector('.main-header') as HTMLElement | null;
      const headerH = headerEl?.offsetHeight ?? 80;
      const heading = document.getElementById('gallery');
      if (!heading) return setInGallery(false);

      const headingTop = heading.getBoundingClientRect().top;
      // Hide exactly when the fixed header would touch the Galerie heading
      setInGallery(headingTop <= headerH);
    };

    computeGalleryVisibility();
    window.addEventListener('scroll', computeGalleryVisibility, { passive: true });
    window.addEventListener('resize', computeGalleryVisibility);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', computeGalleryVisibility);
      window.removeEventListener('resize', computeGalleryVisibility);
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
      <header className={`main-header ${scrolled ? 'header-scrolled' : 'header-top'} ${inGallery ? 'header-hidden' : ''}`}>
        <div className="header-inner">
          <div className="logo-container">
            <a
              href="/"
              className="logo-link"
              aria-label="Go to home"
            >
              <span className="logo-text">print<span className="logo-accent">Orchestra</span></span>
            </a>
            <span className="logo-tagline">AUTONOMOUS CREATION</span>
          </div>
          <nav className="nav-links nav-top">
            <a href="#option1" className={`nav-button ${activeSection === 'option1' ? 'nav-button-active' : ''}`}>Möglichkeit 1</a>
            <a href="#option2" className={`nav-button ${activeSection === 'option2' ? 'nav-button-active' : ''}`}>Möglichkeit 2</a>
            <a href="#option3" className={`nav-button ${activeSection === 'option3' ? 'nav-button-active' : ''}`}>Möglichkeit 3</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-container">
        <div className="hero-split">
          <div className="hero-left">
            {/* Glitch text effect */}
            <div className="glitch-container">
              <h1 className="glitch-text" data-text="3D-DRUCK">3D-DRUCK</h1>
              <div className="glitch-subtext">so einfach wie</div>
              <h1 className="glitch-text" data-text="PAPIERDRUCK">PAPIERDRUCK</h1>
              <p className="glitch-description">Wir verwandeln einen komplexen Laborprozess in ein System mit der Zuverlässigkeit von Industriemaschinen und der Einfachheit eines Papierdruckers.</p>
            </div>
          </div>
          <div className="hero-right">
            <Image
              src="/hero-right.png"
              alt="Resin printing process illustration"
              width={900}
              height={900}
              priority
              unoptimized={UNOPTIMIZED}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="hero-image"
            />
          </div>
        </div>

        <div className="hero-bottom-glow" aria-hidden="true"></div>

        {/* Feature teaser */}
        <div className="features-grid">
          <div className="feature-card" data-reveal="1">
            <div className="feature-icon">◈</div>
            <h3>Autonomes Nachfüllen</h3>
            <p>Für einen ununterbrochenen Workflow</p>
          </div>
          <div className="feature-card" data-reveal="2">
            <div className="feature-icon">◉</div>
            <h3>Selbstreinigung</h3>
            <p>Makellose Drucke, jedes Mal</p>
          </div>
          <div className="feature-card" data-reveal="3">
            <div className="feature-icon">◊</div>
            <h3>Intelligente Aushärtung</h3>
            <p>Automatisierte Perfektion</p>
          </div>
          <div className="feature-card" data-reveal="4">
            <div className="feature-icon">◆</div>
            <h3>24/7-Betrieb</h3>
            <p>Produktion, die niemals schläft</p>
          </div>
        </div>


      </main>

      {/* AI OS Section */}
      <section className="ai-section">
        <h2 className="ai-heading">KI-Betriebssystem</h2>
        <p className="ai-paragraph">Übergeben Sie die 3D-Datei an die KI, und sie übernimmt den Druck für Sie – kein mühsames Anpassen von Druckparametern & Stützeinstellungen mehr.</p>
        <div className="ai-image-wrap">
          <Image
            src="/ki-betriebssystem.png"
            alt="KI-Betriebssystem UI"
            width={1600}
            height={900}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>

      {/* Next Feature Section */}
      <section className="ai-section">
        <h2 className="ai-heading">Immersives UI</h2>
        <p className="ai-paragraph">Space-Joystick mit 6 Freiheitsgraden für die immersive Visualisierung von 3D-Modellen.</p>
        <div className="ai-image-wrap">
          <Image
            src="/immersives-ui.png"
            alt="Immersives UI mit Space-Joystick"
            width={1600}
            height={900}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>

      {/* UV Power Section */}
      <section className="ai-section">
        <h2 className="ai-heading">Präzise UV-Leistung – jederzeit</h2>
        <p className="ai-paragraph">Ein interner UV-Leistungssensor misst und justiert die Leistung nach jeder Schicht. Ein externer UV-Leistungssensor an einem Roboterarm misst und justiert die UV-Leistung – und zwar genau so, wie sie beim Harz im Tank ankommt.</p>
        <div className="ai-image-wrap">
          <Image
            src="/uv-leistung.png"
            alt="UV-Leistungssensor innen und extern"
            width={1600}
            height={900}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>

      {/* German Quality Section */}
      <section className="ai-section">
        <h2 className="ai-heading">Deutsche Qualität – rundum</h2>
        <p className="ai-paragraph">Gleichmäßige, verbesserte aerodynamische Turbulator-Beheizung und Temperaturregelung von mehreren Standorten aus. Smarter Greifer mit mehreren Echtzeitsensoren und Nivellieraktuatoren.</p>
        <div className="ai-image-wrap">
          <Image
            src="/deutsche-qualitaet.png"
            alt="Aerodynamische Beheizung und smarter Greifer"
            width={1600}
            height={900}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>

      {/* Sections */}
      <section id="option1" className="content-section">
<h2 className="section-title"><span className="section-title-main">Möglichkeit 1</span><span className="section-title-sub">Vollautomatisiert mit einem Roboterarm</span></h2>
        <ul className="metrics-list">
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>💰</span>
            <span className="metric-label">Entwicklungskosten</span>
            <span className="metric-value">4 Mio. €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>⏱️</span>
            <span className="metric-label">Entwicklungszeit</span>
            <span className="metric-value">2–3 Jahre</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏭</span>
            <span className="metric-label">Herstellungskosten</span>
            <span className="metric-value">50.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏷️</span>
            <span className="metric-label">Verkaufspreis (UVP)</span>
            <span className="pill pill--purple">120.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>📈</span>
            <span className="metric-label">Amortisationszeit (ROI)</span>
            <span className="pill pill--green">2 Jahre</span>
          </li>
        </ul>
        <div className="ai-image-wrap" style={{ marginTop: '1.5rem' }}>
          <Image
            src="/moeglichkeit-1.png"
            alt="Vollautomatisiertes System mit Roboterarm"
            width={1600}
            height={1200}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>
      <section id="option2" className="content-section">
<h2 className="section-title"><span className="section-title-main">Möglichkeit 2</span><span className="section-title-sub">KI-Betriebssystem-Drucker mit speziellem 4K-Projektor</span></h2>
        <ul className="metrics-list">
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>💰</span>
            <span className="metric-label">Entwicklungskosten</span>
            <span className="metric-value">2 Mio. €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>⏱️</span>
            <span className="metric-label">Entwicklungszeit</span>
            <span className="metric-value">1–2 Jahre</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏭</span>
            <span className="metric-label">Herstellungskosten</span>
            <span className="metric-value">8.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏷️</span>
            <span className="metric-label">Verkaufspreis (UVP)</span>
            <span className="pill pill--purple">20.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>📈</span>
            <span className="metric-label">Amortisationszeit (ROI)</span>
            <span className="pill pill--green">2 Jahre</span>
          </li>
        </ul>
        <div className="ai-image-wrap" style={{ marginTop: '1.5rem' }}>
          <Image
            src="/moeglichkeit-3.png"
            alt="KI-Betriebssystem-Drucker mit LCD"
            width={1600}
            height={1200}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>
      <section id="option3" className="content-section">
<h2 className="section-title"><span className="section-title-main">Möglichkeit 3</span><span className="section-title-sub">KI-Betriebssystem-Drucker mit LCD</span></h2>
        <ul className="metrics-list">
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>💰</span>
            <span className="metric-label">Entwicklungskosten</span>
            <span className="metric-value">1,5 Mio. €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>⏱️</span>
            <span className="metric-label">Entwicklungszeit</span>
            <span className="metric-value">1–2 Jahre</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏭</span>
            <span className="metric-label">Herstellungskosten</span>
            <span className="metric-value">6.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏷️</span>
            <span className="metric-label">Verkaufspreis (UVP)</span>
            <span className="pill pill--purple">15.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>📈</span>
            <span className="metric-label">Amortisationszeit (ROI)</span>
            <span className="pill pill--green">2 Jahre</span>
          </li>
        </ul>
        <div className="ai-image-wrap" style={{ marginTop: '1.5rem' }}>
          <Image
            src="/moeglichkeit-3.png"
            alt="KI-Betriebssystem-Drucker mit LCD"
            width={1600}
            height={1200}
            className="ai-image"
            unoptimized={UNOPTIMIZED}
            sizes="(min-width: 1024px) 80vw, 95vw"
          />
        </div>
      </section>

      {/* Gallery Heading */}
      <section id="gallery" className="ai-section gallery-heading">
        <h2 className="ai-heading">Galerie</h2>
      </section>

      {/* Carousel Section */}
      <Carousel
        id="gallery-carousel"
        images={[
          ...Array.from({ length: 49 }, (_, i) => ({
            src: `/${i + 1}.png`,
            alt: `Galerie Bild ${i + 1}`,
          })),
        ]}
      />

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <span>© 2025 printOrchestra</span>
          <span className="separator">|</span>
          <span>Engineering Tomorrow</span>
        </div>
      </footer>
    </div>
  );
}
