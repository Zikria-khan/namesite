import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { EEAT_CONFIG } from '@/lib/seo/enterprise-seo-config';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('About NameVerse — Editorial Team & Mission | NameVerse'),
  description: validateMetaDescription(
    'NameVerse is a trusted baby name knowledge base. Our editorial team includes linguists, scholars, and researchers specializing in Islamic, Hindu, and Christian naming traditions.'
  ),
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: validateMetaTitle('About NameVerse — Editorial Team & Mission | NameVerse'),
    description: validateMetaDescription(
      'NameVerse is a trusted baby name knowledge base. Our editorial team includes linguists, scholars, and researchers specializing in Islamic, Hindu, and Christian naming traditions.'
    ),
    url: `${siteUrl}/about`,
    type: 'website',
    siteName: 'NameVerse',
  },
};

export default function AboutPage() {
  const team = EEAT_CONFIG.editorialTeam;
  const reviewers = EEAT_CONFIG.reviewers;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            About NameVerse
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            NameVerse is a trusted cultural name knowledge base. We help parents discover 
            meaningful names with verified meanings, origins, and cultural context across 
            Islamic, Hindu, Christian, and global traditions.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Our mission is to build the most comprehensive, accurate, and culturally 
              respectful baby name resource on the internet. We believe every name carries 
              a story — a linguistic history, a cultural tradition, and a meaning that 
              connects generations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are committed to:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Accuracy:</strong> Every name meaning is verified against authoritative linguistic sources.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Cultural Respect:</strong> We present names within their authentic cultural and religious contexts.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Transparency:</strong> Our editorial process, sources, and methodology are publicly documented.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 mt-1">✓</span>
                <span><strong>Inclusivity:</strong> We cover Islamic, Hindu, Christian, and global naming traditions with equal depth.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Editorial Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Editorial Team</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{member.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p><strong>Experience:</strong> {member.experience}</p>
                  <p><strong>Languages:</strong> {member.languages.join(', ')}</p>
                  <p><strong>Expertise:</strong> {member.expertise.join(', ')}</p>
                  <p><strong>Credentials:</strong> {member.credentials}</p>
                </div>
                {member.linkedin && (
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View LinkedIn Profile →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Reviewers Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fact-Checking & Review Team</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reviewers.map((reviewer) => (
              <div key={reviewer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  {reviewer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-gray-900">{reviewer.name}</h3>
                <p className="text-sm text-emerald-600 font-medium">{reviewer.title}</p>
                <p className="text-sm text-gray-500 mt-2">{reviewer.credentials}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Process Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Editorial Process</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                <div>
                  <h3 className="font-bold text-gray-900">Research</h3>
                  <p className="text-gray-600 text-sm">Each name is researched using authoritative linguistic sources including classical dictionaries, religious texts, and academic references.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                <div>
                  <h3 className="font-bold text-gray-900">Verification</h3>
                  <p className="text-gray-600 text-sm">Meanings, origins, and cultural context are cross-referenced against multiple sources to ensure accuracy.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                <div>
                  <h3 className="font-bold text-gray-900">Review</h3>
                  <p className="text-gray-600 text-sm">Content is reviewed by subject-matter experts specializing in the relevant linguistic and cultural tradition.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">4</span>
                <div>
                  <h3 className="font-bold text-gray-900">Publication</h3>
                  <p className="text-gray-600 text-sm">Approved content is published with clear attribution, publication dates, and source citations.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">5</span>
                <div>
                  <h3 className="font-bold text-gray-900">Ongoing Review</h3>
                  <p className="text-gray-600 text-sm">All content is periodically reviewed and updated to maintain accuracy and relevance.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions, suggestions, or corrections? We'd love to hear from you.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </section>
      </div>
    </main>
  );
}