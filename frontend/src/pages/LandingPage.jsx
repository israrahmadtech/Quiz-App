import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const features = [
  {
    icon: "⚡",
    title: "Instant Feedback",
    desc: "Real-time results and explanations after every quiz attempt.",
    accent: "#f59e0b",
  },
  {
    icon: "🛡️",
    title: "Role-based Access",
    desc: "Admins create & manage quizzes while users play and track progress.",
    accent: "#06b6d4",
  },
  {
    icon: "📊",
    title: "Leaderboards",
    desc: "Compete with others and climb the ranks on every quiz.",
    accent: "#a855f7",
  },
  {
    icon: "🏆",
    title: "Rich History",
    desc: "Track attempts, scores and improvement over time.",
    accent: "#10b981",
  },
];

const stats = [
  { value: "50+", label: "Quizzes", icon: "🎯" },
  { value: "10k+", label: "Questions", icon: "📚" },
  { value: "5k+", label: "Players", icon: "👾" },
  { value: "99%", label: "Satisfaction", icon: "🌟" },
];

const floatingWords = ["Science", "History", "Math", "Sports", "Tech", "Art", "Music", "Geography"];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numeric = parseInt(target.replace(/\D/g, ""));
    if (!numeric) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numeric));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start]);
  return count;
}

function StatCard({ stat, index, inView }) {
  const numeric = parseInt(stat.value.replace(/\D/g, ""));
  const suffix = stat.value.replace(/[\d]/g, "");
  const count = useCountUp(stat.value, 1800, inView);
  return (
    <div
      className="stat-card"
      style={{
        animationDelay: `${index * 0.12}s`,
        "--accent": ["#f59e0b", "#06b6d4", "#a855f7", "#10b981"][index],
      }}
    >
      <div className="stat-icon">{stat.icon}</div>
      <div className="stat-value">
        {inView ? count : 0}{suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-glow" />
    </div>
  );
}

export default function LandingPage() {
  const [statsInView, setStatsInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsInView(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #07080d;
          --surface: #0d0f1a;
          --border: rgba(255,255,255,0.07);
          --text: #f0f0ff;
          --muted: #5a5f7a;
          --amber: #f59e0b;
          --cyan: #06b6d4;
          --violet: #a855f7;
          --green: #10b981;
          --primary: #6366f1;
        }

        body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; overflow-x: hidden; }

        /* ─── NOISE OVERLAY ─── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 999;
          opacity: 0.4;
        }

        /* ─── NAVBAR ─── */
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          background: rgba(7,8,13,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          text-decoration: none;
          color: var(--text);
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--amber), var(--primary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }

        .nav-actions { display: flex; gap: 10px; align-items: center; }

        .btn-ghost {
          padding: 9px 20px;
          font-size: 0.85rem;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

        .btn-primary {
          padding: 9px 22px;
          font-size: 0.85rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          background: var(--primary);
          color: #fff;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .btn-primary:hover::after { opacity: 1; }

        /* ─── HERO ─── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px;
          overflow: hidden;
        }

        /* Grid lines background */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent);
        }

        /* Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%);
          top: -200px; left: 50%; transform: translateX(-50%);
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(245,158,11,0.12), transparent 70%);
          bottom: 0; right: -100px;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%);
          bottom: 100px; left: -50px;
        }

        /* Floating category pills */
        .floating-pills {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .pill {
          position: absolute;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          border: 1px solid;
          opacity: 0;
          animation: floatUp 12s infinite linear;
        }

        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          10% { opacity: 0.5; }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-120vh) scale(1.1); }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          margin-bottom: 32px;
          border-radius: 100px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.25);
          font-size: 0.78rem;
          font-family: 'Space Mono', monospace;
          color: var(--amber);
          letter-spacing: 0.05em;
          animation: fadeDown 0.8s ease both;
        }

        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--amber);
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6.5rem);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.04em;
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
          animation: fadeDown 0.9s ease 0.1s both;
        }

        .hero-title-accent {
          display: block;
          position: relative;
          color: transparent;
          -webkit-text-stroke: 2px rgba(255,255,255,0.15);
          background: linear-gradient(90deg, var(--amber), var(--primary), var(--violet));
          background-size: 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .hero-sub {
          font-size: 1.05rem;
          color: var(--muted);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 40px;
          font-weight: 400;
          position: relative;
          z-index: 2;
          animation: fadeDown 1s ease 0.2s both;
        }

        .hero-ctas {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          z-index: 2;
          animation: fadeDown 1.1s ease 0.3s both;
        }

        .btn-cta {
          padding: 14px 32px;
          font-size: 0.95rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
          cursor: pointer;
          border: none;
        }

        .btn-cta-main {
          background: linear-gradient(135deg, var(--primary), var(--violet));
          color: #fff;
          box-shadow: 0 0 30px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-cta-main:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 50px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .btn-cta-outline {
          background: rgba(255,255,255,0.04);
          color: var(--text);
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
        }
        .btn-cta-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }

        .arrow { transition: transform 0.2s; }
        .btn-cta-main:hover .arrow { transform: translateX(4px); }

        /* Scroll indicator */
        .scroll-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-family: 'Space Mono', monospace;
          color: var(--muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          animation: fadeIn 2s ease 1s both;
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--primary), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        /* ─── STATS ─── */
        .stats-section {
          padding: 60px 24px;
          position: relative;
        }

        .stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }

        .stat-card {
          position: relative;
          padding: 36px 24px;
          background: var(--surface);
          text-align: center;
          overflow: hidden;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
          transition: background 0.3s;
        }
        .stat-card:hover { background: #111425; }

        .stat-icon { font-size: 1.8rem; margin-bottom: 12px; }

        .stat-value {
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text);
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 0.78rem;
          font-family: 'Space Mono', monospace;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .stat-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: var(--accent, var(--primary));
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 99px;
        }
        .stat-card:hover .stat-glow { opacity: 1; }

        /* ─── FEATURES ─── */
        .features-section {
          padding: 100px 24px;
          position: relative;
        }

        .section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--primary);
          text-align: center;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          text-align: center;
          margin-bottom: 16px;
        }

        .section-sub {
          color: var(--muted);
          text-align: center;
          max-width: 440px;
          margin: 0 auto 60px;
          font-size: 0.95rem;
          line-height: 1.7;
          font-weight: 400;
        }

        .features-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .feature-card {
          position: relative;
          padding: 36px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface);
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s;
          cursor: default;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, var(--card-accent, transparent), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .feature-card:hover { transform: translateY(-4px); }
        .feature-card:hover::before { opacity: 0.08; }
        .feature-card:hover { border-color: rgba(255,255,255,0.12); }

        .feature-number {
          position: absolute;
          top: 28px;
          right: 28px;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: var(--muted);
          opacity: 0.5;
        }

        .feature-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 20px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
        }

        .feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .feature-desc {
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.7;
          font-weight: 400;
        }

        .feature-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--card-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .feature-card:hover .feature-bar { transform: scaleX(1); }

        /* ─── MARQUEE ─── */
        .marquee-section {
          padding: 50px 0;
          overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .marquee-item {
          padding: 10px 22px;
          border-radius: 100px;
          border: 1px solid var(--border);
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          color: var(--muted);
          white-space: nowrap;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .marquee-item span { color: var(--primary); font-size: 1rem; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ─── CTA ─── */
        .cta-section {
          padding: 120px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .cta-box {
          max-width: 680px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .cta-box-inner {
          padding: 64px;
          border-radius: 28px;
          border: 1px solid rgba(99,102,241,0.25);
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05));
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .cta-box-inner::before {
          content: '';
          position: absolute;
          top: -1px; left: 50%; transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
        }

        .cta-emoji {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 24px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .cta-title {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .cta-sub {
          color: var(--muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 36px;
          font-weight: 400;
        }

        /* ─── FOOTER ─── */
        .footer {
          padding: 28px 40px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          font-family: 'Space Mono', monospace;
          color: var(--muted);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--text);
          font-family: 'Syne', sans-serif;
          text-decoration: none;
        }

        /* ─── ANIMATIONS ─── */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .footer { flex-direction: column; gap: 12px; text-align: center; }
          .cta-box-inner { padding: 40px 28px; }
          .hero-title { font-size: 2.8rem; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <div className="logo-mark">⚡</div>
          QuizMaster
        </Link>
        <div className="nav-actions">
          <Link to="/login" className="btn-ghost">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Floating pills */}
        <div className="floating-pills">
          {floatingWords.map((word, i) => (
            <div
              key={word}
              className="pill"
              style={{
                left: `${10 + (i * 11.5) % 85}%`,
                bottom: `-${20 + (i * 7) % 30}%`,
                animationDelay: `${i * 1.4}s`,
                animationDuration: `${10 + (i % 4) * 2}s`,
                borderColor: ["#f59e0b40", "#6366f140", "#a855f740", "#06b6d440", "#10b98140"][i % 5],
                color: ["#f59e0b", "#818cf8", "#a855f7", "#06b6d4", "#10b981"][i % 5],
                background: ["rgba(245,158,11,0.06)", "rgba(99,102,241,0.06)", "rgba(168,85,247,0.06)", "rgba(6,182,212,0.06)", "rgba(16,185,129,0.06)"][i % 5],
              }}
            >
              {word}
            </div>
          ))}
        </div>

        <div className="badge">
          <span className="badge-dot" />
          New quizzes added weekly
        </div>

        <h1 className="hero-title">
          Test Your
          <span className="hero-title-accent">Knowledge.</span>
          Dominate.
        </h1>

        <p className="hero-sub">
          Play quizzes across dozens of categories, battle on leaderboards,
          and track your learning — all in one arena.
        </p>

        <div className="hero-ctas">
          <Link to="/register" className="btn-cta btn-cta-main">
            Start for Free <span className="arrow">→</span>
          </Link>
          <Link to="/login" className="btn-cta btn-cta-outline">
            Sign In
          </Link>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line" />
          scroll
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) =>
            ["🧪 Science", "📜 History", "🔢 Mathematics", "⚽ Sports", "💻 Technology", "🎨 Art", "🎵 Music", "🌍 Geography", "🎬 Cinema", "🍳 Food", "🐾 Animals", "🚀 Space"].map((item, i) => (
              <div key={`${rep}-${i}`} className="marquee-item">
                <span>{item.split(" ")[0]}</span>
                {item.split(" ").slice(1).join(" ")}
              </div>
            ))
          )}
        </div>
      </div>

      {/* STATS */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={statsInView} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <p className="section-eyebrow">// Why QuizMaster</p>
        <h2 className="section-title">Built for Competitors</h2>
        <p className="section-sub">Everything you need to learn faster, compete harder, and climb the ranks.</p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ "--card-accent": f.accent }}
            >
              <span className="feature-number">0{i + 1}</span>
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-box">
          <div className="cta-box-inner">
            <span className="cta-emoji">🎯</span>
            <h2 className="cta-title">Ready to challenge yourself?</h2>
            <p className="cta-sub">
              Create your free account and jump into the arena. No credit card.
              No fluff. Just quizzes.
            </p>
            <Link to="/register" className="btn-cta btn-cta-main" style={{ margin: "0 auto", display: "inline-flex" }}>
              Create Free Account <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <Link to="/" className="footer-brand">
          <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 13 }}>⚡</div>
          QuizMaster
        </Link>
        <span>© {new Date().getFullYear()} — Built with React & Node.js</span>
      </footer>
    </>
  );
}