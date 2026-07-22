import { SEOHead } from "../components/SEOHead";
import { LegalLayout, LegalSection, LegalText, LegalList } from "../components/LegalLayout";

export function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Kind Supply Digital"
        description="How Kind Supply Digital collects, uses, and protects information from visitors and clients, including our SMS messaging and text message privacy practices."
        canonical="https://kindsupplydigital.com/privacy-policy"
      />

      <LegalLayout
        eyebrow="Legal"
        title="Privacy Policy"
        effectiveDate="July 22, 2026"
        intro="Kind Supply Digital respects your privacy. This policy explains what information we collect, why we collect it, how we use it, and the choices you have — in plain language, without the legal fog."
      >
        <LegalSection title="1. Who We Are">
          <LegalText>
            Kind Supply Digital ("Kind Supply Digital," "we," "us," or "our") is a digital
            marketing agency based in Northern Virginia. We build websites, search engine
            optimization, Google Business Profiles, paid advertising campaigns, and lead
            management systems for businesses in behavioral health, home services, legal,
            dental, and related industries.
          </LegalText>
          <LegalText>
            This policy applies to kindsupplydigital.com and to the services we provide
            directly to our clients. It does not apply to third-party websites we may link to.
          </LegalText>
        </LegalSection>

        <LegalSection title="2. Information We Collect">
          <LegalText>
            <strong className="text-white/70">Information you give us.</strong> When you submit
            a consultation request, email us, or call us, we collect what you choose to
            provide — typically your name, email address, phone number, company name,
            industry, website address, budget range, and any details you share about your
            project.
          </LegalText>
          <LegalText>
            <strong className="text-white/70">Information collected automatically.</strong> Like
            most websites, we collect standard technical information when you visit: IP
            address, browser type and version, device type, referring page, pages viewed,
            and time spent on the site. This is collected through cookies and similar
            technologies, including analytics services.
          </LegalText>
          <LegalText>
            <strong className="text-white/70">Client data.</strong> When you become a client, we
            may process data on your behalf as part of delivering our services — for example,
            leads submitted through a website we built for you, or contact records inside a
            lead management system we configured for you. That data belongs to you. We
            process it only to provide the services you've engaged us for.
          </LegalText>
        </LegalSection>

        <LegalSection title="3. How We Use Information">
          <LegalList
            items={[
              "To respond to your inquiry and schedule a consultation",
              "To provide, maintain, and improve the services you've hired us for",
              "To send you information you requested, and occasional updates about our services",
              "To understand how visitors use our site so we can improve it",
              "To comply with legal obligations, enforce our agreements, and protect against fraud or misuse",
            ]}
          />
          <LegalText>
            We do not sell your personal information. We have never sold it, and we do not
            rent, trade, or otherwise monetize it.
          </LegalText>
        </LegalSection>

        <LegalSection title="4. SMS and Text Message Communications">
          <LegalText>
            If you provide your phone number and consent to receive text messages from us,
            or from a lead management system we operate on behalf of a client, the following
            applies:
          </LegalText>
          <LegalList
            items={[
              <>
                <strong className="text-white/70">
                  No mobile information will be shared with third parties or affiliates for
                  marketing or promotional purposes.
                </strong>{" "}
                Information sharing to subcontractors in support services, such as customer
                service or messaging platform providers, is permitted. All other use case
                categories exclude text messaging originator opt-in data and consent; this
                information will not be shared with any third parties.
              </>,
              "Consent to receive text messages is not a condition of purchasing any goods or services.",
              "Message frequency varies based on your interaction with us. Message and data rates may apply.",
              "You can opt out at any time by replying STOP to any message. You will receive one confirmation message and then no further messages.",
              "Reply HELP to any message for assistance, or contact us at partnerships@kindsupplydigital.com.",
              "Carriers are not liable for delayed or undelivered messages.",
            ]}
          />
        </LegalSection>

        <LegalSection title="5. Cookies and Analytics">
          <LegalText>
            We use cookies and similar technologies to operate the site, remember your
            preferences, and understand traffic patterns. We may use third-party analytics
            and advertising platforms — such as Google Analytics, Google Ads, and Meta —
            which set their own cookies and process data under their own privacy policies.
          </LegalText>
          <LegalText>
            You can control cookies through your browser settings. Disabling them may affect
            how parts of the site function.
          </LegalText>
        </LegalSection>

        <LegalSection title="6. How We Share Information">
          <LegalText>We share information only in these situations:</LegalText>
          <LegalList
            items={[
              "With service providers who help us operate — hosting, email delivery, analytics, CRM and messaging platforms — each bound to use the information only to provide those services",
              "With your explicit direction or consent",
              "When required by law, subpoena, or valid legal process, or to protect our rights, safety, or property",
              "In connection with a merger, acquisition, or sale of assets, in which case we will notify you before your information becomes subject to a different privacy policy",
            ]}
          />
        </LegalSection>

        <LegalSection title="7. Healthcare Clients and Protected Health Information">
          <LegalText>
            We work with behavioral health providers, treatment centers, and other healthcare
            organizations. Where our services involve access to protected health information
            (PHI) as defined under the Health Insurance Portability and Accountability Act
            (HIPAA), we will execute a Business Associate Agreement (BAA) with the client and
            handle that information according to its terms and applicable law.
          </LegalText>
          <LegalText>
            This website is not intended for the submission of protected health information.
            Please do not include patient names, clinical details, or other sensitive health
            information in a consultation request form.
          </LegalText>
        </LegalSection>

        <LegalSection title="8. Data Retention and Security">
          <LegalText>
            We keep information only as long as needed for the purposes described here, or as
            required by law. We use reasonable administrative, technical, and physical
            safeguards to protect the information we hold — including encrypted transmission,
            access controls, and vetted third-party infrastructure.
          </LegalText>
          <LegalText>
            No method of transmission or storage is completely secure. While we work hard to
            protect your information, we cannot guarantee absolute security.
          </LegalText>
        </LegalSection>

        <LegalSection title="9. Your Rights and Choices">
          <LegalText>
            Depending on where you live, you may have the right to access, correct, delete, or
            request a copy of the personal information we hold about you, and to object to or
            restrict certain processing. Virginia residents have specific rights under the
            Virginia Consumer Data Protection Act; residents of other states and countries may
            have comparable rights.
          </LegalText>
          <LegalText>
            To exercise any of these rights, email us at partnerships@kindsupplydigital.com.
            We will respond within the timeframe required by applicable law. You may also
            unsubscribe from marketing emails at any time using the link in any message.
          </LegalText>
        </LegalSection>

        <LegalSection title="10. Children's Privacy">
          <LegalText>
            Our services are directed to businesses, not to children. We do not knowingly
            collect personal information from anyone under 13. If you believe a child has
            provided us information, contact us and we will delete it.
          </LegalText>
        </LegalSection>

        <LegalSection title="11. Changes to This Policy">
          <LegalText>
            We may update this policy as our services or the law changes. When we do, we'll
            revise the effective date at the top of this page. Material changes will be
            communicated more directly where appropriate.
          </LegalText>
        </LegalSection>

        <LegalSection title="12. Contact Us">
          <LegalText>
            Questions about this policy, or about how we handle your information? Email{" "}
            <a
              href="mailto:partnerships@kindsupplydigital.com"
              className="text-blue-300/80 hover:text-blue-200 transition-colors"
            >
              partnerships@kindsupplydigital.com
            </a>
            .
          </LegalText>
          <LegalText>
            Kind Supply Digital
            <br />
            Northern Virginia, United States
          </LegalText>
        </LegalSection>
      </LegalLayout>
    </>
  );
}
