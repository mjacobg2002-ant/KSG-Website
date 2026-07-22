import { SEOHead } from "../components/SEOHead";
import { LegalLayout, LegalSection, LegalText, LegalList } from "../components/LegalLayout";

export function TermsPage() {
  return (
    <>
      <SEOHead
        title="Terms of Service | Kind Supply Digital"
        description="The terms governing use of the Kind Supply Digital website and the web design, SEO, advertising, and lead system services we provide."
        canonical="https://kindsupplydigital.com/terms"
      />

      <LegalLayout
        eyebrow="Legal"
        title="Terms of Service"
        effectiveDate="July 22, 2026"
        intro="These terms govern your use of this website and the services Kind Supply Digital provides. We've written them to be readable — if anything here is unclear, ask us and we'll explain it straight."
      >
        <LegalSection title="1. Agreement to These Terms">
          <LegalText>
            By using kindsupplydigital.com or engaging Kind Supply Digital ("we," "us," or
            "our") for services, you agree to these Terms of Service. If you're agreeing on
            behalf of a company, you represent that you have authority to bind that company.
          </LegalText>
          <LegalText>
            Where a signed proposal, statement of work, or service agreement exists between us
            and a client, that document governs the specifics of the engagement. These terms
            fill in everything it doesn't address. If the two conflict, the signed agreement
            controls.
          </LegalText>
        </LegalSection>

        <LegalSection title="2. Our Services">
          <LegalText>We provide digital marketing and growth services, which may include:</LegalText>
          <LegalList
            items={[
              "Website design, development, and rebuilds",
              "Search engine optimization and keyword research",
              "Google Business Profile setup and optimization",
              "Paid advertising management across Google, Meta, and similar platforms",
              "Content strategy and production",
              "The Lead Rescue System — missed-call text-back, automated follow-up, and CRM lead tracking",
              "Review generation, referral, and reactivation automation",
            ]}
          />
          <LegalText>
            The exact scope, deliverables, timeline, and price for any engagement are defined
            in your proposal or statement of work.
          </LegalText>
        </LegalSection>

        <LegalSection title="3. Fees and Payment">
          <LegalText>
            <strong className="text-white/70">Setup fees</strong> are due before work begins
            unless your agreement states otherwise. <strong className="text-white/70">Monthly
            fees</strong> are billed in advance on a recurring basis and continue until
            cancelled. <strong className="text-white/70">Website builds</strong> are quoted
            per project, with payment milestones set out in your proposal.
          </LegalText>
          <LegalText>
            Advertising spend is separate from management fees and is paid directly to the
            advertising platform by the client unless agreed otherwise in writing.
          </LegalText>
          <LegalText>
            Invoices are due on receipt unless stated otherwise. Accounts more than fifteen
            days past due may have services paused until the balance is cleared. Fees already
            paid are non-refundable except where these terms or your agreement expressly
            provide otherwise.
          </LegalText>
        </LegalSection>

        <LegalSection title="4. The One-Job Guarantee">
          <LegalText>
            We offer a one-job guarantee on the Lead Rescue System: if the system does not
            capture at least one qualified inbound job, case, appointment, or client inquiry
            during your first thirty days after it goes live, we will refund the setup fee for
            that system.
          </LegalText>
          <LegalText>The guarantee applies when all of the following are true:</LegalText>
          <LegalList
            items={[
              "The system was fully deployed and remained active for the entire thirty-day period",
              "The client did not disable, bypass, or materially alter the system's workflows, phone routing, or messaging",
              "The client provided the access, approvals, and business information needed to configure the system",
              "The client's account is current on all fees",
              "The refund is requested in writing within fifteen days after the end of the thirty-day period",
            ]}
          />
          <LegalText>
            The guarantee covers the setup fee for the Lead Rescue System only. It does not
            cover monthly fees for months already served, advertising spend, website build
            fees, or other services. It is limited to one claim per client.
          </LegalText>
        </LegalSection>

        <LegalSection title="5. Cancellation">
          <LegalText>
            Ongoing services have no long-term contract. Either party may cancel a recurring
            engagement with thirty days' written notice. Fees for the current billing period
            are not prorated, and service continues through the end of that period.
          </LegalText>
          <LegalText>
            Project-based work, such as a website build, may be cancelled in writing at any
            time. In that case, you are responsible for fees covering work completed to date,
            and any deposit already paid is applied against that amount.
          </LegalText>
        </LegalSection>

        <LegalSection title="6. Client Responsibilities">
          <LegalText>
            Our work depends on your input. You agree to provide accurate business
            information, necessary account access, and timely feedback and approvals. Delays
            in providing these will move project timelines accordingly.
          </LegalText>
          <LegalText>
            You are responsible for the accuracy and legality of any content, claims,
            credentials, licensing information, or offers you ask us to publish, and you
            confirm you have the rights to any materials you provide us.
          </LegalText>
          <LegalText>
            <strong className="text-white/70">Messaging compliance.</strong> Where we deploy
            SMS or automated calling on your behalf, you are responsible for obtaining and
            maintaining valid consent from the people you contact, and for complying with the
            Telephone Consumer Protection Act, carrier requirements, and all other applicable
            regulations. We will configure required opt-out handling and assist with carrier
            registration, but we cannot consent on your behalf.
          </LegalText>
        </LegalSection>

        <LegalSection title="7. Intellectual Property">
          <LegalText>
            Upon full payment, you own the final website design, custom content, and
            deliverables we create specifically for you. Ownership of your domain, your
            business content, and your data remains yours throughout.
          </LegalText>
          <LegalText>
            We retain ownership of our underlying methods, frameworks, templates, workflow
            architecture, code libraries, and general know-how, including the configuration
            patterns behind the Lead Rescue System. Third-party assets — fonts, stock imagery,
            plugins, platform software — remain subject to their own licenses.
          </LegalText>
          <LegalText>
            Unless you ask us otherwise in writing, we may reference our work with you in our
            portfolio and marketing materials.
          </LegalText>
        </LegalSection>

        <LegalSection title="8. Third-Party Platforms">
          <LegalText>
            Our services rely on platforms we don't control — Google, Meta, hosting providers,
            CRM and messaging systems, telecom carriers, and others. Their policies, pricing,
            algorithms, approval processes, and availability can change without notice, and
            outages or policy decisions on their end may affect your results.
          </LegalText>
          <LegalText>
            We'll work to adapt when they change, but we are not responsible for the actions,
            downtime, or decisions of third-party platforms.
          </LegalText>
        </LegalSection>

        <LegalSection title="9. Results and Disclaimers">
          <LegalText>
            Apart from the one-job guarantee described above, we do not guarantee specific
            search rankings, lead volume, conversion rates, revenue, or return on investment.
            Marketing outcomes depend on factors outside our control, including your market,
            competition, pricing, capacity, reputation, and how your team handles the
            inquiries we generate.
          </LegalText>
          <LegalText>
            Our services are provided on an "as is" and "as available" basis, without
            warranties of any kind beyond those expressly stated here or in your agreement.
          </LegalText>
        </LegalSection>

        <LegalSection title="10. Limitation of Liability">
          <LegalText>
            To the fullest extent permitted by law, Kind Supply Digital will not be liable for
            indirect, incidental, special, consequential, or punitive damages, or for lost
            profits, lost revenue, lost data, or business interruption, arising from your use
            of this website or our services.
          </LegalText>
          <LegalText>
            Our total liability for any claim relating to our services will not exceed the
            amount you paid us for the specific service giving rise to the claim during the
            three months preceding the claim.
          </LegalText>
        </LegalSection>

        <LegalSection title="11. Confidentiality">
          <LegalText>
            Each party agrees to protect the other's non-public business information and use
            it only to fulfill the engagement. This obligation survives the end of our working
            relationship. Where healthcare data is involved, the terms of a separate Business
            Associate Agreement apply.
          </LegalText>
        </LegalSection>

        <LegalSection title="12. Governing Law">
          <LegalText>
            These terms are governed by the laws of the Commonwealth of Virginia, without
            regard to its conflict of law rules. Any dispute will be brought in the state or
            federal courts located in Virginia, and both parties consent to that jurisdiction.
          </LegalText>
          <LegalText>
            Before filing anything, both parties agree to make a good-faith effort to resolve
            the issue directly. Most problems are a conversation, not a lawsuit.
          </LegalText>
        </LegalSection>

        <LegalSection title="13. Changes to These Terms">
          <LegalText>
            We may update these terms as our services evolve. Changes take effect when posted,
            with a revised effective date at the top of this page. Continued use of our website
            or services after that means you accept the updated terms. Changes will not
            retroactively alter a signed agreement already in effect.
          </LegalText>
        </LegalSection>

        <LegalSection title="14. Contact Us">
          <LegalText>
            Questions about these terms? Email{" "}
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
