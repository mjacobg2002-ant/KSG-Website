import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";
import { articles } from "../data/articles";

export function InsightsPage() {
  return (
    <div>
      <SEOHead
        title="Healthcare Digital Marketing Insights & Strategy Blog | Kind Supply Digital"
        description="Expert insights on behavioral health website design, mental health clinic SEO, patient acquisition strategies, treatment center marketing, and healthcare digital growth. Actionable strategies for behavioral health providers."
        keywords="healthcare digital marketing blog, mental health clinic SEO tips, treatment center website strategies, healthcare website design insights, patient acquisition strategies, behavioral health marketing tips, HIPAA website best practices"
        canonical="https://kindsupplydigital.com/insights"
        structuredData={{
          "@type": "Blog",
          name: "Kind Supply Digital — Healthcare Marketing Insights",
          description: "Expert insights on behavioral health digital marketing, healthcare website design, and patient acquisition strategy.",
          publisher: {
            "@type": "Organization",
            name: "Kind Supply Digital",
          },
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            description: a.excerpt,
            articleSection: a.category,
            author: { "@type": "Organization", name: "Kind Supply Digital" },
            url: `https://kindsupplydigital.com/insights/${a.slug}`,
          })),
        }}
      />
      {/* Header */}
      <section className="pt-32 pb-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <p
              className="text-blue-300/30 uppercase tracking-[0.3em] mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500 }}
            >
              Insights
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Digital Strategy Insights
            </h1>
            <p
              className="text-white/35 max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Thought leadership and strategic perspectives on healthcare digital
              marketing, SEO, and growth for behavioral health providers.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {articles.map((article, i) => (
            <AnimatedSection key={article.slug} delay={i * 0.08}>
              <Link to={`/insights/${article.slug}`} className="block">
                <article className="py-12 border-b border-white/5 group">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-12">
                    <div className="flex items-center gap-4 shrink-0 lg:w-40">
                      <span
                        className="text-white/15 group-hover:text-white/30 transition-colors duration-500"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}
                      >
                        {article.date}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-white/20 group-hover:text-blue-300/40 uppercase tracking-[0.15em] mb-3 block transition-colors duration-500"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                      >
                        {article.category}
                      </span>
                      <h2
                        className="text-white/70 group-hover:text-white transition-colors duration-500 mb-3"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.4rem",
                          fontWeight: 400,
                          lineHeight: 1.3,
                        }}
                      >
                        {article.title}
                      </h2>
                      <p
                        className="text-white/25 group-hover:text-white/40 transition-colors duration-500 mb-4 max-w-2xl"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
                      >
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-white/15 group-hover:text-white/30 transition-colors duration-500">
                        <div className="flex items-center gap-1">
                          <Clock size={13} />
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
                            {article.readTime}
                          </span>
                        </div>
                        <span
                          className="text-blue-300/0 group-hover:text-blue-300/60 transition-colors duration-500 flex items-center gap-1"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500 }}
                        >
                          Read Article
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-500 shrink-0 hidden lg:block mt-10"
                    />
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
              }}
            >
              Have a Project in Mind?
            </h2>
            <p
              className="text-white/35 mb-12"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Let's turn your digital vision into reality.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Start a Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
