import Header from '@/components/Header';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Header />

      {/* Hero Section - Split Layout */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span className="text-sm font-semibold text-indigo-700">
                  Trusted by 500+ Indian Founders
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Fuel Your Startup
                  <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Journey with Resources
                  </span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  Access grants, challenges, expert mentors, and exclusive partnerships—all in one platform designed for Indian founders.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                  Start Free Today
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <StatItem value="₹200Cr+" label="Available Funding" />
                <StatItem value="50+" label="Active Challenges" />
                <StatItem value="100+" label="Expert Mentors" />
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative lg:h-[600px] hidden lg:block">
              {/* Floating Cards */}
              <div className="absolute inset-0">
                {/* Card 1 */}
                <div className="absolute top-8 left-0 w-64 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 animate-float">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">💰</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">GRANT</p>
                      <p className="text-sm font-bold text-slate-900">₹50L Available</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Startup India Seed Fund for early-stage...
                  </p>
                </div>

                {/* Card 2 */}
                <div className="absolute top-32 right-0 w-64 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 animate-float-delayed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🎯</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">CHALLENGE</p>
                      <p className="text-sm font-bold text-slate-900">₹10L Prize Pool</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AI Innovation Challenge by Tech Giants...
                  </p>
                </div>

                {/* Card 3 */}
                <div className="absolute bottom-24 left-12 w-64 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 animate-float">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🤝</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">MENTOR</p>
                      <p className="text-sm font-bold text-slate-900">1-on-1 Session</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connect with experienced founders from...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wider">
              Platform Features
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stop juggling multiple platforms. Get all startup resources, opportunities, and connections in a single dashboard.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BentoCard
              icon="💰"
              title="Curated Grants"
              description="Access government and private grants matched to your startup stage and sector."
              gradient="from-emerald-500 to-teal-600"
              size="large"
            />
            <BentoCard
              icon="🎯"
              title="Innovation Challenges"
              description="Participate in challenges with prizes and partnerships."
              gradient="from-blue-500 to-cyan-600"
            />
            <BentoCard
              icon="🤝"
              title="Expert Mentorship"
              description="Connect with founders who've been there, done that."
              gradient="from-purple-500 to-pink-600"
            />
            <BentoCard
              icon="🚀"
              title="Partner Benefits"
              description="Exclusive offers from tools and services."
              gradient="from-orange-500 to-red-600"
            />
            <BentoCard
              icon="📊"
              title="Smart Matching"
              description="AI-powered recommendations based on your profile."
              gradient="from-indigo-500 to-purple-600"
              size="large"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Join India's fastest-growing founder community
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              From idea to scale, we've got the resources and connections you need to succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
                Create Free Account
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <TrustBadge icon="✓" text="No credit card required" />
              <TrustBadge icon="✓" text="Free forever" />
              <TrustBadge icon="✓" text="Setup in 2 minutes" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">Outpost</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Empowering Indian founders with opportunities and connections.
              </p>
            </div>

            {/* Resources */}
            <FooterColumn title="Resources">
              <FooterLink href="/grants">Grants</FooterLink>
              <FooterLink href="/challenges">Challenges</FooterLink>
              <FooterLink href="/mentors">Mentors</FooterLink>
              <FooterLink href="/partners">Partners</FooterLink>
            </FooterColumn>

            {/* Company */}
            <FooterColumn title="Company">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterColumn>

            {/* Legal */}
            <FooterColumn title="Legal">
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/cookies">Cookies</FooterLink>
            </FooterColumn>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2026 Outpost. Built with ❤️ for founders.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon="twitter" />
              <SocialLink href="#" icon="linkedin" />
              <SocialLink href="#" icon="github" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

function BentoCard({
  icon,
  title,
  description,
  gradient,
  size = 'normal',
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  size?: 'normal' | 'large';
}) {
  return (
    <div
      className={`group relative p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer ${
        size === 'large' ? 'md:col-span-2' : ''
      }`}
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-emerald-300 font-bold">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-slate-400 hover:text-white transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: 'twitter' | 'linkedin' | 'github' }) {
  const icons = {
    twitter: (
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    ),
    linkedin: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
    github: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
  };

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
      aria-label={icon}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
    </a>
  );
}

export default HomePage;
