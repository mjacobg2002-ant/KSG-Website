import { Link, useParams, Navigate } from "react-router";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { AnimatedSection } from "../components/AnimatedSection";
import { SEOHead } from "../components/SEOHead";
import { getArticleBySlug, articles } from "../data/articles";

export function InsightArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  // Find next/prev articles for navigation
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div>
      <SEOHead
        title={`${article.title} | Kind Supply Digital`}
        description={article.excerpt}
        keywords={`${article.category.toLowerCase()}, behavioral health marketing, healthcare digital marketing, ${article.title.toLowerCase().split(" ").slice(0, 5).join(", ")}`}
        canonical={`https://kindsupplydigital.com/insights/${article.slug}`}
        ogType="article"
        structuredData={{
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          articleSection: article.category,
          author: {
            "@type": "Organization",
            name: "Kind Supply Digital",
            url: "https://kindsupplydigital.com",
          },
          publisher: {
            "@type": "Organization",
            name: "Kind Supply Digital",
          },
        }}
      />

      {/* Article Header */}
      <section className="pt-32 pb-16 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 text-blue-300/40 hover:text-blue-300/80 transition-colors mb-10 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", letterSpacing: "0.05em" }}
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Insights
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-blue-300/40 uppercase tracking-[0.15em]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600 }}
              >
                {article.category}
              </span>
            </div>

            <h1
              className="text-white mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 400,
                lineHeight: 1.15,
              }}
            >
              {article.title}
            </h1>

            <p
              className="text-white/50 mb-8"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", lineHeight: "1.8" }}
            >
              {article.excerpt}
            </p>

            <div className="flex items-center gap-6 text-white/25">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
                  {article.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
                  {article.readTime}
                </span>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
                By Kind Supply Digital
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {article.content.map((section, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className={i > 0 ? "mt-12" : ""}>
                {section.heading && (
                  <h2
                    className="text-white mb-6"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.6rem",
                      fontWeight: 400,
                      lineHeight: 1.3,
                    }}
                  >
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, pi) => (
                  <p
                    key={pi}
                    className="text-white/45 mb-6 last:mb-0"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: "2" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Author / Company Attribution */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="p-8 border border-blue-400/10 hover:border-blue-400/20 transition-colors duration-500">
              <p
                className="text-blue-300/30 uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
              >
                About the Author
              </p>
              <p
                className="text-white/80 mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 500 }}
              >
                Kind Supply Digital
              </p>
              <p
                className="text-white/40"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: "1.7" }}
              >
                Kind Supply Digital is a healthcare-focused digital agency specializing in website
                design, SEO, and patient acquisition systems for behavioral health providers,
                treatment centers, and human services organizations.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Prev / Next Navigation */}
      <section className="py-12 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevArticle ? (
              <AnimatedSection>
                <Link
                  to={`/insights/${prevArticle.slug}`}
                  className="group block p-6 border border-white/5 hover:border-blue-400/20 transition-all duration-500"
                >
                  <span
                    className="text-white/20 uppercase tracking-[0.15em] mb-3 block"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                  >
                    Previous Article
                  </span>
                  <p
                    className="text-white/60 group-hover:text-white transition-colors duration-500"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", lineHeight: 1.3 }}
                  >
                    {prevArticle.title}
                  </p>
                </Link>
              </AnimatedSection>
            ) : (
              <div />
            )}
            {nextArticle && (
              <AnimatedSection delay={0.1}>
                <Link
                  to={`/insights/${nextArticle.slug}`}
                  className="group block p-6 border border-white/5 hover:border-blue-400/20 transition-all duration-500 text-right"
                >
                  <span
                    className="text-white/20 uppercase tracking-[0.15em] mb-3 block"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600 }}
                  >
                    Next Article
                  </span>
                  <p
                    className="text-white/60 group-hover:text-white transition-colors duration-500"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", lineHeight: 1.3 }}
                  >
                    {nextArticle.title}
                  </p>
                </Link>
              </AnimatedSection>
            )}
          </div>
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
              Ready to Apply These Strategies?
            </h2>
            <p
              className="text-white/35 mb-12 max-w-xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", lineHeight: "1.8" }}
            >
              Let's discuss how Kind Supply Digital can implement these strategies for your
              behavioral health organization.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-500 text-white hover:bg-blue-400 transition-all duration-300 group"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.05em" }}
            >
              Get Your Free Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
