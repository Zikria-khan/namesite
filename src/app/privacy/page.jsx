import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 31536000; // 365 days

export const metadata = {
  title: validateMetaTitle('Privacy Policy | NameVerse — Protecting Your Personal Information'),
  description: validateMetaDescription('Read the NameVerse Privacy Policy. We are committed to protecting your privacy and explaining how we handle your data when you use our baby names database service.'),
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
    languages: { en: `${getSiteUrl()}/privacy`, 'x-default': `${getSiteUrl()}/privacy` },
  },
};

export default function PrivacyPage() {
  return (
    <SitePage
      title="Privacy Policy"
      subtitle="How we protect and handle your information"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Privacy Policy' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700">
        <p className="text-sm text-slate-500 mb-8">Last updated: January 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="leading-relaxed">
            NameVerse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website
            or use our baby names database service.
          </p>
        </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Personal Information</h3>
            <p className="leading-relaxed">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Subscribe to our newsletter (email address)</li>
              <li>Contact us with questions or feedback</li>
              <li>Save favorite names (stored locally in your browser)</li>
              <li>Use our search functionality (search queries)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Automatically Collected Information</h3>
            <p className="leading-relaxed">
              When you visit our website, we automatically collect certain information including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and approximate location</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Click patterns and user interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Personalize your experience on our website</li>
              <li>Understand how users interact with our content</li>
              <li>Send you newsletters and updates (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Protect against unauthorized access and legal violations</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Provide relevant content and advertisements</li>
              <li>Analyze traffic and usage patterns</li>
            </ul>
            <p className="leading-relaxed mt-4">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="leading-relaxed">
              We may use third-party services that collect, monitor, and analyze data:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Analytics:</strong> Google Analytics, Ahrefs Analytics</li>
              <li><strong>Hosting:</strong> Vercel, AWS</li>
              <li><strong>CDN:</strong> Content delivery networks for faster loading</li>
            </ul>
            <p className="leading-relaxed mt-4">
              These third parties have their own privacy policies governing their use of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your 
              personal information. However, no method of transmission over the Internet is 100% secure, 
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal 
              information from children under 13. If you become aware that a child has provided us with 
              personal information, please contact us and we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@nameverse.com
            </p>
          </section>
      </div>
    </SitePage>
  );
}
