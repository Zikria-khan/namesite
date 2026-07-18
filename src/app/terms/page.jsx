import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// 30-day cache — single source of truth: src/lib/cache/cache-config.js DEFAULT_CACHE_TTL_SECONDS
export const revalidate = 2592000;

export const metadata = {
  title: validateMetaTitle('Terms of Service | NameVerse — Use Our Baby Name Search Platform Responsibly'),
  description: validateMetaDescription('Read the NameVerse Terms of Service for our baby names search platform. Learn how to use NameVerse responsibly when accessing Islamic, Hindu, and Christian name data.'),
  keywords: [
    'NameVerse',
    'NameVerse terms',
    'Terms of Service',
    'baby names platform terms',
    'name search terms',
    'baby name website terms',
    'NameVerse service policy',
    'terms for baby name search'
  ].join(', '),
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
    languages: { en: `${getSiteUrl()}/terms`, 'x-default': `${getSiteUrl()}/terms` },
  },
};

export default function TermsPage() {
  return (
    <SitePage
      title="Terms of Service"
      subtitle="Using NameVerse responsibly"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Terms of Service' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700">
        <p className="text-sm text-slate-500 mb-8">Last updated: January 2026</p>

          <section className="mb-8">
            <p className="leading-relaxed">
              These Terms of Service govern your use of NameVerse, the baby names search platform for Islamic, Hindu, and Christian names. By using NameVerse to search names, meanings, and origins, you agree to use our database and tools responsibly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using NameVerse ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="leading-relaxed">
              Permission is granted to temporarily access the materials (information or software) on NameVerse 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for any commercial purpose</li>
              <li>You may not attempt to decompile or reverse engineer any software</li>
              <li>You may not remove any copyright or proprietary notations</li>
              <li>You may not transfer the materials to another person</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
            <p className="leading-relaxed">
              The materials on NameVerse are provided on an 'as is' basis. NameVerse makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
            <p className="leading-relaxed">
              In no event shall NameVerse or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on NameVerse.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p className="leading-relaxed">
              The materials appearing on NameVerse could include technical, typographical, or photographic errors. 
              NameVerse does not warrant that any of the materials on its service are accurate, complete, or current. 
              We strive to provide accurate information about baby names, meanings, and origins, but we recommend 
              verifying important information from multiple sources.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Links</h2>
            <p className="leading-relaxed">
              NameVerse has not reviewed all of the sites linked to its service and is not responsible for the 
              contents of any such linked site. The inclusion of any link does not imply endorsement by NameVerse 
              of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
            <p className="leading-relaxed">
              NameVerse may revise these Terms of Service for its service at any time without notice. By using 
              this service, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with applicable laws and 
              you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: coding4443@gmail.com            </p>
          </section>
      </div>
    </SitePage>
  );
}
