import { Link } from 'react-router-dom';
import { FiZap, FiAward, FiClock, FiTrendingUp, FiArrowRight, FiUsers } from 'react-icons/fi';

const FEATURES = [
  { icon: <FiZap />, title: 'Instant Feedback', desc: 'Get real-time scoring and explanations after every quiz.' },
  { icon: <FiClock />, title: 'Timed Challenges', desc: 'Race against the clock with our countdown timer system.' },
  { icon: <FiAward />, title: 'Leaderboards', desc: 'Compete globally and climb the rankings per quiz.' },
  { icon: <FiTrendingUp />, title: 'Track Progress', desc: 'Detailed history and analytics for every attempt.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <span className="flex items-center gap-2 font-bold text-xl text-white">
          <span className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <FiZap className="text-white text-sm" />
          </span>
          QuizMaster
        </span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary py-1.5 px-4 text-sm">Login</Link>
          <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 max-w-7xl pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-500/30 text-brand-300 text-xs font-semibold mb-8 animate-slide-down">
          <FiUsers className="text-brand-400" /> Thousands of quizzes available
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight animate-slide-up">
          Test Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
            Knowledge
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 animate-fade-in">
          Challenge yourself with hundreds of quizzes across every topic. Compete, learn, and track your growth.
        </p>
        <div className="flex gap-4 justify-center animate-slide-up">
          <Link to="/register" className="btn-primary px-8 py-3 flex items-center gap-2 text-base">
            Start for Free <FiArrowRight />
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-3 text-base">Browse Quizzes</Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-16 animate-fade-in">
          {[['500+','Quizzes'],['10K+','Players'],['50K+','Attempts']].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-display font-bold text-brand-400">{n}</div>
              <div className="text-gray-500 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 max-w-7xl pb-24">
        <h2 className="text-center text-3xl font-display font-bold text-white mb-12">
          Everything you need to master any topic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card hover:border-brand-500/30 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 bg-brand-600/20 rounded-xl flex items-center justify-center text-brand-400 mb-4 text-lg">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-2xl pb-24 text-center">
        <div className="card border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-purple-900/20">
          <h2 className="text-3xl font-display font-bold text-white mb-3">Ready to start?</h2>
          <p className="text-gray-400 mb-6">Join thousands of curious minds expanding their knowledge daily.</p>
          <Link to="/register" className="btn-primary px-10 py-3 inline-flex items-center gap-2">
            Create Free Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
