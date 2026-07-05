import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Mail, MessageCircle, MapPin, Clock, Send } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Contact NameVerse — Get in Touch With Our Team | NameVerse'),
  description: validateMetaDescription(
    'Have questions, suggestions, or corrections? Contact NameVerse for support with our baby names database, naming guides, and cultural name research.'
  ),
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: validateMetaTitle('Contact NameVerse — Get in Touch'),
    description: validateMetaDescription(
      'Reach out to our editorial team for questions about baby names, meanings, origins, or technical support.'
    ),
    url: `${siteUrl}/contact`,
    type: 'website',
    siteName: 'NameVerse',
  },
};

export default function ContactPage() {
  return (
    <SitePage
      title="Contact Us"
      subtitle="We'd love to hear from you"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Contact' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700">
        <p className="text-lg">
          Have questions about our baby name database, suggestions for corrections, or need help finding the perfect name? 
          Our editorial team is here to help.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Email Us</h3>
            </div>
            <p className="text-slate-600">
              For general inquiries, corrections, or collaboration requests, email us at:
            </p>
            <p className="font-semibold text-blue-600 mt-2">
              hello@nameverse.com
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Response Time</h3>
            </div>
            <p className="text-slate-600">
              We typically respond within 24-48 hours on weekdays. For urgent matters, 
              include "Urgent" in your subject line.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Frequently Asked Questions About Contact
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold text-slate-900">How do I suggest a name correction?</h3>
            <p className="text-slate-600 mt-1">
              Email us with the name, current information, and suggested correction. 
              Include sources for verification when possible.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold text-slate-900">Can I submit my own naming story?</h3>
            <p className="text-slate-600 mt-1">
              Yes! We welcome guest stories about naming traditions and cultural heritage. 
              Send us your story for consideration.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold text-slate-900">Do you offer naming consultations?</h3>
            <p className="text-slate-600 mt-1">
              We provide general guidance through our guides and articles. For personalized 
              consultations, we recommend consulting with cultural or religious advisors.
            </p>
          </div>
        </div>
      </div>
    </SitePage>
  );
}