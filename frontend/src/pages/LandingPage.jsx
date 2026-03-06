import { Link } from 'react-router-dom';
import { HiArrowRight, HiLightningBolt, HiShieldCheck, HiChartBar, HiStar } from 'react-icons/hi';

const features = [
  { icon: HiLightningBolt, title: 'Instant Feedback', desc: 'Get real-time results and explanations after every quiz attempt.' },
  { icon: HiShieldCheck,   title: 'Role-based Access', desc: 'Admins create & manage quizzes. Users play and track progress.' },
  { icon: HiChartBar,      title: 'Leaderboards',      desc: 'Compete with others and climb the ranks on every quiz.' },
  { icon: HiStar,          title: 'Rich History',      desc: 'Track all your attempts, scores, and improvement over time.' },
];

const stats = [
  { value: '50+', label: 'Quizzes Available' },
  { value: '10k+', label: 'Questions' },
  { value: '5k+', label: 'Active Players' },
  { value: '99%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-xl">⚡</div>
            QuizMaster
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"    className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-primary-600/15 border border-primary-500/20 text-primary-300 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            New quizzes added weekly
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-none">
            Challenge Your
            <span className="block bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              Knowledge
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Test yourself across dozens of categories, compete on leaderboards,
            and track your progress over time with QuizMaster.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-7 py-3 gap-2">
              Start for Free <HiArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-7 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Everything you need</h2>
          <p className="text-slate-400 text-center mb-12">A complete quiz platform built for learners and educators.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:border-primary-500/30 transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-primary-600/20 flex items-center justify-center mb-4 group-hover:bg-primary-600/30 transition-colors">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center card border-primary-500/20 bg-gradient-to-br from-primary-950/50 to-slate-900">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-3">Ready to test yourself?</h2>
          <p className="text-slate-400 mb-6">Join thousands of learners. Create your free account in seconds.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-3 gap-2">
            Create Free Account <HiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} QuizMaster. Built with React & Node.js.
      </footer>
    </div>
  );
}
