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
  
  // Cost/Time/ROI Toggles
  const [isCost1Open, setIsCost1Open] = useState(false);
  const [isCost2Open, setIsCost2Open] = useState(false);
  const [isCost3Open, setIsCost3Open] = useState(false);
  const [isTime1Open, setIsTime1Open] = useState(false);
  const [isTime2Open, setIsTime2Open] = useState(false);
  const [isTime3Open, setIsTime3Open] = useState(false);
  
  // ROI Calculation Toggles
  const [isRoi1Open, setIsRoi1Open] = useState(false);
  const [isRoi2Open, setIsRoi2Open] = useState(false);
  const [isRoi3Open, setIsRoi3Open] = useState(false);

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
        <h2 className="ai-heading">Neuartige UI & Steuerung</h2>
        <div className="ai-paragraph" style={{ textAlign: 'left', fontSize: '1.05rem', lineHeight: 1.8 }}>
          <div>- Space-Joystick mit 6 Freiheitsgraden für die immersive Visualisierung von 3D-Modellen.</div>
          <div>- Leistungsstarker Controller mit KI-Betriebssystem (kein externer Computer erforderlich)</div>
          <div>- Integrierte, hochwertige Slicing-Software innerhalb der KI-Systemarchitektur</div>
          <div>- Perfekt abgestimmte Resin-Parameter und Druckprofile für eine Erfolgsquote von 99 %</div>
          <div>- Einfache Übermittlung der 3D-Datei an die KI zur direkten Ausführung des Drucks</div>
        </div>
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
        <h2 className="ai-heading">Zuverlässigkeit, die überzeugt.</h2>
        <p className="ai-paragraph">Gleichmäßige, verbesserte aerodynamische Turbulator-Beheizung und Temperaturregelung von mehreren Standorten aus. Intelligente Bauplattform mit mehreren Echtzeitsensoren und Nivellieraktuatoren - Aktive, präzise Steuerung an allen vier Ecken für konstant perfekte Druckergebnisse: Kein manuelles Leveling mit A4-Papier mehr und kein Raten, ob der Abstand passt.</p>
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

      {/* Option 1: Robot Arm (Full Auto) */}
      <section id="option1" className="content-section">
        <h2 className="section-title"><span className="section-title-main">Möglichkeit 1</span><span className="section-title-sub">Vollautomatisiert mit einem Roboterarm</span></h2>
        <ul className="metrics-list">
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>💰</span>
              <span className="metric-label">Entwicklungskosten</span>{' '}
              <button
                type="button"
                className="metric-value metric-value-toggle"
                onClick={() => setIsCost1Open((open) => !open)}
              >
                Bis zu 4 Mio. €
                <span className={`metric-toggle-arrow ${isCost1Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isCost1Open && (
              <div className="metric-breakdown">
                <div className="metric-breakdown-line">- 60 % Gehälter und externe Dienstleistungen</div>
                <div className="metric-breakdown-line">- 15 % Werkzeuge und Ausrüstung (z. B. Oszilloskop)</div>
                <div className="metric-breakdown-line">- 25 % Prototypenentwicklung</div>
              </div>
            )}
          </li>
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>⏱️</span>
              <span className="metric-label">Entwicklungszeit</span>
              <button
                type="button"
                className="metric-value metric-value-toggle"
                onClick={() => setIsTime1Open((open) => !open)}
              >
                Bis zu 3 Jahre
                <span className={`metric-toggle-arrow ${isTime1Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isTime1Open && (
              <div className="metric-breakdown">
                <div className="metric-breakdown-line">- Versuchsplanung (DoE) und Konstruktion – 6 Monate</div>
                <div className="metric-breakdown-line">- Entwicklung unabhängiger Systeme (z. B. Slicer) – 12 Monate</div>
                <div className="metric-breakdown-line">- Prototypenentwicklung einschließlich des finalen Prototyps – 12 Monate</div>
                <div className="metric-breakdown-line">- Pufferzeit – 6 Monate</div>
              </div>
            )}
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏭</span>
            <span className="metric-label">Herstellungskosten</span>
            <span className="metric-value">Bis zu 50.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏷️</span>
            <span className="metric-label">Verkaufspreis (UVP)</span>
            <span className="pill pill--purple">120.000 €</span>
          </li>
          {/* New Interactive ROI Section for Option 1 */}
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>📈</span>
              <span className="metric-label">Kunden-ROI</span>
              <button
                type="button"
                className="pill pill--green"
                onClick={() => setIsRoi1Open((open) => !open)}
              >
                &lt; 2 Jahre
                <span className={`metric-toggle-arrow ${isRoi1Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isRoi1Open && (
              <div className="metric-breakdown">
                <div className="roi-summary-block">
                  <p><strong>Vollautomatisierung:</strong> Der Roboterarm ersetzt den Techniker komplett. Ideal für Volumengeschäfte.</p>
                </div>
                
                {/* Scenario A: Dental Models */}
                <div className="roi-block-header">Szenario A: Zahnmodelle (Masse)</div>
                <div className="roi-data-table">
                  <div className="roi-data-row">
                    <span className="roi-data-label">Eingespartes Gehalt (2 Jahre):</span>
                    <span className="roi-data-value">120.000 €</span>
                  </div>
                  <div className="roi-data-row">
                    <span className="roi-data-label roi-data-total">Amortisation:</span>
                    <span className="roi-data-value roi-data-total">&lt; 2 Jahre</span>
                  </div>
                </div>

                {/* Scenario B: Splints */}
                <div className="roi-block-header">Szenario B: Schienen/Trays (Marge)</div>
                <div className="roi-data-table">
                  <div className="roi-data-row">
                    <span className="roi-data-label">Jahresgewinn (Netto):</span>
                    <span className="roi-data-value">58.040 €</span>
                  </div>
                  <div className="roi-data-row">
                    <span className="roi-data-label roi-data-total">Amortisation:</span>
                    <span className="roi-data-value roi-data-total">2,1 Jahre</span>
                  </div>
                </div>
              </div>
            )}
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

      {/* Option 2: 20k Machine (High Tech) */}
      <section id="option2" className="content-section">
        <h2 className="section-title"><span className="section-title-main">Möglichkeit 2</span><span className="section-title-sub">KI-Betriebssystem-Drucker mit speziellem 4K-Projektor</span></h2>
        <ul className="metrics-list">
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>💰</span>
              <span className="metric-label">Entwicklungskosten</span>{' '}
              <button
                type="button"
                className="metric-value metric-value-toggle"
                onClick={() => setIsCost2Open((open) => !open)}
              >
                Bis zu 2 Mio. €
                <span className={`metric-toggle-arrow ${isCost2Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isCost2Open && (
              <div className="metric-breakdown">
                <div className="metric-breakdown-line">- 60 % Gehälter und externe Dienstleistungen</div>
                <div className="metric-breakdown-line">- 15 % Werkzeuge und Ausrüstung (z. B. Oszilloskop)</div>
                <div className="metric-breakdown-line">- 25 % Prototypenentwicklung</div>
              </div>
            )}
          </li>
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>⏱️</span>
              <span className="metric-label">Entwicklungszeit</span>
              <button
                type="button"
                className="metric-value metric-value-toggle"
                onClick={() => setIsTime2Open((open) => !open)}
              >
                Bis zu 2 Jahre
                <span className={`metric-toggle-arrow ${isTime2Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isTime2Open && (
              <div className="metric-breakdown">
                <div className="metric-breakdown-line">- Versuchsplanung (DoE) und Konstruktion – 6 Monate</div>
                <div className="metric-breakdown-line">- Entwicklung unabhängiger Systeme (z. B. Slicer) – 6 Monate</div>
                <div className="metric-breakdown-line">- Prototypenentwicklung einschließlich des finalen Prototyps – 6 Monate</div>
                <div className="metric-breakdown-line">- Pufferzeit – 6 Monate</div>
              </div>
            )}
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏭</span>
            <span className="metric-label">Herstellungskosten</span>
            <span className="metric-value">Bis zu 8.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏷️</span>
            <span className="metric-label">Verkaufspreis (UVP)</span>
            <span className="pill pill--purple">20.000 €</span>
          </li>
          {/* New Interactive ROI Section for Option 2 */}
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>📈</span>
              <span className="metric-label">Kunden-ROI</span>
              <button
                type="button"
                className="pill pill--green"
                onClick={() => setIsRoi2Open((open) => !open)}
              >
                Ab 4 Monaten
                <span className={`metric-toggle-arrow ${isRoi2Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isRoi2Open && (
              <div className="metric-breakdown">
                <div className="roi-summary-block">
                  <p><strong>Zuverlässigkeit (99%):</strong> Spart im Vergleich zu Billigdruckern ca. 2.500€ pro Jahr an Fehlerkosten.</p>
                </div>

                {/* Scenario A: Dental Models */}
                <div className="roi-block-header">Szenario A: Zahnmodelle (Masse)</div>
                <div className="roi-data-table">
                  <div className="roi-data-row">
                    <span className="roi-data-label">Worst-Case (12 Modelle/Tag):</span>
                    <span className="roi-data-value">1,6 Jahre</span>
                  </div>
                  <div className="roi-data-row">
                    <span className="roi-data-label roi-data-total">Standard (36 Modelle/Tag):</span>
                    <span className="roi-data-value roi-data-total">0,5 Jahre</span>
                  </div>
                </div>

                {/* Scenario B: Splints */}
                <div className="roi-block-header">Szenario B: Schienen/Trays (Marge)</div>
                <div className="roi-data-table">
                  <div className="roi-data-row">
                    <span className="roi-data-label">Jahresgewinn (Netto):</span>
                    <span className="roi-data-value">54.476 €</span>
                  </div>
                   <div className="roi-data-row">
                    <span className="roi-data-label">Volumen:</span>
                    <span className="roi-data-value">Nur ~5 Teile / Woche</span>
                  </div>
                  <div className="roi-data-row">
                    <span className="roi-data-label roi-data-total">Amortisation:</span>
                    <span className="roi-data-value roi-data-total">4,3 Monate</span>
                  </div>
                </div>
              </div>
            )}
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

      {/* Option 3: 15k Machine (LCD) */}
      <section id="option3" className="content-section">
        <h2 className="section-title"><span className="section-title-main">Möglichkeit 3</span><span className="section-title-sub">KI-Betriebssystem-Drucker mit LCD</span></h2>
        <ul className="metrics-list">
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>💰</span>
              <span className="metric-label">Entwicklungskosten</span>{' '}
              <button
                type="button"
                className="metric-value metric-value-toggle"
                onClick={() => setIsCost3Open((open) => !open)}
              >
                Bis zu 1,5 Mio. €
                <span className={`metric-toggle-arrow ${isCost3Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isCost3Open && (
              <div className="metric-breakdown">
                <div className="metric-breakdown-line">- 60 % Gehälter und externe Dienstleistungen</div>
                <div className="metric-breakdown-line">- 15 % Werkzeuge und Ausrüstung (z. B. Oszilloskop)</div>
                <div className="metric-breakdown-line">- 25 % Prototypenentwicklung</div>
              </div>
            )}
          </li>
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>⏱️</span>
              <span className="metric-label">Entwicklungszeit</span>
              <button
                type="button"
                className="metric-value metric-value-toggle"
                onClick={() => setIsTime3Open((open) => !open)}
              >
                Bis zu 2 Jahre
                <span className={`metric-toggle-arrow ${isTime3Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isTime3Open && (
              <div className="metric-breakdown">
                <div className="metric-breakdown-line">- Versuchsplanung (DoE) und Konstruktion – 6 Monate</div>
                <div className="metric-breakdown-line">- Entwicklung unabhängiger Systeme (z. B. Slicer) – 6 Monate</div>
                <div className="metric-breakdown-line">- Prototypenentwicklung einschließlich des finalen Prototyps – 6 Monate</div>
                <div className="metric-breakdown-line">- Pufferzeit – 6 Monate</div>
              </div>
            )}
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏭</span>
            <span className="metric-label">Herstellungskosten</span>
            <span className="metric-value">Bis zu 6.000 €</span>
          </li>
          <li className="metric-item">
            <span className="metric-icon" aria-hidden>🏷️</span>
            <span className="metric-label">Verkaufspreis (UVP)</span>
            <span className="pill pill--purple">15.000 €</span>
          </li>
          {/* New Interactive ROI Section for Option 3 */}
          <li className="metric-item metric-item--with-breakdown">
            <div className="metric-row-header">
              <span className="metric-icon" aria-hidden>📈</span>
              <span className="metric-label">Kunden-ROI</span>
              <button
                type="button"
                className="pill pill--green"
                onClick={() => setIsRoi3Open((open) => !open)}
              >
                Ab 3 Monaten
                <span className={`metric-toggle-arrow ${isRoi3Open ? 'is-open' : ''}`}> ▾</span>
              </button>
            </div>
            {isRoi3Open && (
              <div className="metric-breakdown">
                <div className="roi-summary-block">
                   <p><strong>Niedrige Einstiegshürde:</strong> Maximale Rentabilität bei Spezialanwendungen.</p>
                </div>

                {/* Scenario A: Dental Models */}
                <div className="roi-block-header">Szenario A: Zahnmodelle (Masse)</div>
                <div className="roi-data-table">
                  <div className="roi-data-row">
                    <span className="roi-data-label">Worst-Case (12 Modelle/Tag):</span>
                    <span className="roi-data-value">1,2 Jahre</span>
                  </div>
                  <div className="roi-data-row">
                    <span className="roi-data-label roi-data-total">Standard (36 Modelle/Tag):</span>
                    <span className="roi-data-value roi-data-total">0,4 Jahre</span>
                  </div>
                </div>

                {/* Scenario B: Splints */}
                <div className="roi-block-header">Szenario B: Schienen/Trays (Marge)</div>
                <div className="roi-data-table">
                  <div className="roi-data-row">
                    <span className="roi-data-label">Jahresgewinn (Netto):</span>
                    <span className="roi-data-value">54.476 €</span>
                  </div>
                  <div className="roi-data-row">
                    <span className="roi-data-label roi-data-total">Amortisation:</span>
                    <span className="roi-data-value roi-data-total">3,2 Monate</span>
                  </div>
                </div>
              </div>
            )}
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

      <section className="ai-section">
        <h2 className="ai-heading">App-Steuerung</h2>
        <p className="ai-paragraph">Im Folgenden sehen Sie eine Demonstration unserer Windows-Test-App, die einen Desk MC-5 Drucker steuert. Wir werden fortschrittliche Steuerungs-Apps für iOS, Android, Windows und Mac entwickeln.</p>
        <div className="ai-image-wrap">
          <Image
            src="/app-control.png"
            alt="App-Steuerung für Desk MC-5 Drucker"
            width={1600}
            height={900}
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