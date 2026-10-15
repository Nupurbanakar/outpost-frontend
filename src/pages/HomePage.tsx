import Header from '@/components/Header';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f4ec]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#f3f0e7]">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(32, 44, 61, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(32, 44, 61, 0.035) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-[1500px] mx-auto px-6 lg:px-20 py-16 lg:py-24">
          <div className="max-w-4xl">
            {/* Member Badge */}
            <div className="inline-flex items-center gap-2 mb-6 lg:mb-8">
              <span className="w-2 h-2 bg-[#56846d] rounded-full animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#777b7d]">
                For Indian Founders
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#202c3d] mb-6 lg:mb-8 leading-[1.05]">
              Everything you need to
              <br />
              <span className="text-[#875e24]">build & grow</span> your
              startup
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-[#72777b] mb-10 lg:mb-12 max-w-2xl leading-relaxed">
              Discover grants, challenges, mentorship opportunities, and
              partnerships curated specifically for Indian founders at every
              stage of their journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-3 px-8 h-14 bg-[#202c3d] text-[#f7f4ec] text-base font-semibold border border-[#202c3d] hover:bg-[#304258] hover:-translate-y-1 transition-all duration-200 shadow-md hover:shadow-xl">
                Get Started
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

              <button className="inline-flex items-center justify-center gap-3 px-8 h-14 bg-transparent text-[#202c3d] text-base font-semibold border border-[#bfb7a9] hover:bg-[#eee9de] hover:border-[#202c3d] hover:-translate-y-1 transition-all duration-200">
                Explore Resources
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-[#ded7ca]">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-9 h-9 rounded-full bg-[#d69b42] border-2 border-[#f3f0e7]" />
                    <div className="w-9 h-9 rounded-full bg-[#467c68] border-2 border-[#f3f0e7]" />
                    <div className="w-9 h-9 rounded-full bg-[#b86a64] border-2 border-[#f3f0e7]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#202c3d]">
                      500+ Founders
                    </p>
                    <p className="text-xs text-[#72777b]">Already onboard</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-[#ded7ca]" />

                <div>
                  <p className="text-sm font-semibold text-[#202c3d]">
                    ₹200Cr+ in Grants
                  </p>
                  <p className="text-xs text-[#72777b]">Accessible funding</p>
                </div>

                <div className="h-8 w-px bg-[#ded7ca]" />

                <div>
                  <p className="text-sm font-semibold text-[#202c3d]">
                    50+ Challenges
                  </p>
                  <p className="text-xs text-[#72777b]">Active opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-20 py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block px-4 py-2 bg-[#f1e6d2] text-[#80591f] text-xs font-mono uppercase tracking-wider mb-4">
            What We Offer
          </span>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-[#202c3d] tracking-tight">
            Everything in one place
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Card 1 */}
          <FeatureCard
            icon="💰"
            title="Grants & Funding"
            description="Discover government and private grants tailored to your startup stage and sector."
            color="#f1e6d2"
            textColor="#80591f"
          />

          {/* Feature Card 2 */}
          <FeatureCard
            icon="🎯"
            title="Challenges"
            description="Participate in innovation challenges and win prizes while solving real problems."
            color="#e2ece5"
            textColor="#376b58"
          />

          {/* Feature Card 3 */}
          <FeatureCard
            icon="🤝"
            title="Mentorship"
            description="Connect with experienced mentors who understand your journey and can guide you."
            color="#f0e2df"
            textColor="#925651"
          />

          {/* Feature Card 4 */}
          <FeatureCard
            icon="🚀"
            title="Partnerships"
            description="Access exclusive offers and benefits from partners who support founders."
            color="#f1e6d2"
            textColor="#80591f"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#202c3d] text-[#f7f4ec]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-20 py-16 lg:py-20 text-center">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
            Ready to accelerate your startup?
          </h2>
          <p className="text-lg text-[#c3c8c9] mb-10 max-w-2xl mx-auto">
            Join hundreds of Indian founders who are already using Outpost to
            discover opportunities and grow their startups.
          </p>
          <button className="inline-flex items-center justify-center gap-3 px-8 h-14 bg-[#d69b42] text-[#202c3d] text-base font-bold hover:bg-[#e5b45d] hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl">
            Create Free Account
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fbf9f3] border-t border-[#e2dccc]">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-20 py-12 lg:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-8 h-8 rounded-full bg-[#202c3d] flex items-center justify-center">
                  <div className="relative w-3 h-3 border-[2px] border-[#e9b75f] rounded-full">
                    <span className="absolute top-[3px] left-[3px] w-1.5 h-1.5 bg-[#e9b75f] rounded-full" />
                  </div>
                </div>
                <span className="font-serif text-lg font-bold text-[#202c3d]">
                  Outpost
                </span>
              </div>
              <p className="text-sm text-[#72777b] leading-relaxed">
                Empowering Indian founders with curated opportunities, funding,
                and mentorship.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#202c3d] mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <FooterLink href="/grants">Grants</FooterLink>
                <FooterLink href="/challenges">Challenges</FooterLink>
                <FooterLink href="/mentors">Mentors</FooterLink>
                <FooterLink href="/partners">Partners</FooterLink>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#202c3d] mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#202c3d] mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/cookies">Cookies</FooterLink>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#ded7ca] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#72777b]">
              © 2026 Outpost. Built for founders, by founders.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[#72777b] hover:text-[#202c3d] transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#72777b] hover:text-[#202c3d] transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
  textColor,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
}) {
  return (
    <div className="group p-6 lg:p-8 border border-[#ded8cc] bg-[#fffdf8] hover:border-[#c7b89c] hover:-translate-y-1 transition-all duration-200 hover:shadow-lg">
      <div
        className="inline-flex items-center justify-center w-12 h-12 mb-4 text-2xl"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <h3
        className="font-serif text-xl font-bold mb-3 tracking-tight"
        style={{ color: textColor }}
      >
        {title}
      </h3>
      <p className="text-sm text-[#72777b] leading-relaxed">{description}</p>
    </div>
  );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-[#72777b] hover:text-[#202c3d] transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

export default HomePage;
