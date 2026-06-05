import PageLayout from '@/components/Layout/PageLayout';
import StructuredData from '@/components/SEO/StructuredData';
import { getSiteUrl } from '@/lib/seo/site';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import AdSlot from '@/components/Ads/AdSlot';

const siteUrl = getSiteUrl();

// ISR: 30-day cache — static content, no need for frequent updates
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle("About NameVerse & Zakriya Khan — Baby Name Research Expert"),
  description: validateMetaDescription("Learn about NameVerse and baby names expert Zakriya Khan. Discover how NameVerse researches Islamic, Hindu, and Christian baby names with verified meanings and authentic origin details."),
  alternates: {
    canonical: `${getSiteUrl()}/about`,
    languages: { en: `${getSiteUrl()}/about`, 'x-default': `${getSiteUrl()}/about` },
  },
  keywords: ["NameVerse", "About NameVerse", "baby names expert", "baby name research", "Islamic names", "Hindu names", "Christian names", "baby name meanings", "religious names", "name origin research", "meaningful baby names", "name consultant", "name search platform"].join(', '),
  openGraph: {
    title: "About Zakriya Khan - Name Meanings Expert & Cultural Consultant",
    description: "Meet Zakriya Khan - Expert in name meanings, cultural heritage, and spiritual significance.",
    url: `${getSiteUrl()}/about`,
    type: 'website',
    images: [{
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
      alt: 'About Zakriya Khan'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Zakriya Khan - Name Meanings Expert",
    description: "Expert in name meanings, cultural heritage, and spiritual significance.",
  },
};

const personData = {
  name: "Zakriya Khan",
  jobTitle: "Name Meanings Expert & Cultural Consultant",
  description: "Professional consultant specializing in name meanings, cultural heritage, and spiritual significance",
  url: `${siteUrl}/about`,
  sameAs: ["https://www.linkedin.com/in/zakriya-khan-a6321a390/"],
  contactPoint: {
    telephone: "+92-349-7174815",
    contactType: "Professional Services",
    availableLanguage: ["English", "Urdu", "Arabic"],
  },
};

export default function AboutPage() {
  return (
    <>
      <StructuredData
        person={personData}
        breadcrumbs={[
          { name: "Home", url: siteUrl },
          { name: "About", url: `${siteUrl}/about` },
        ]}
      />
      
      <PageLayout
        title="About Zakriya Khan"
        subtitle="Name Meanings Expert & Cultural Consultant"
        bgColor="bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 sm:p-12 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 text-sm font-semibold border border-white/30">
                <span>NameVerse Founder & Baby Name Expert</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Helping families discover meaningful baby names with NameVerse
              </h2>
              
              <p className="text-lg sm:text-xl text-white/95 max-w-3xl mx-auto mb-8">
                As founder of NameVerse, I make it easier to choose Islamic, Hindu, and Christian baby names with verified meanings, origin stories, and spiritual insight.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://wa.me/923497174815" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:shadow-xl transition-all"
                >
                  WhatsApp Consultation
                </a>
                 <a 
                   href="https://www.linkedin.com/in/zakriya-khan-a6321a390/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white hover:text-purple-700 transition-all border border-white/30"
                 >
                   LinkedIn Profile
                 </a>
               </div>
             </div>
           </section>
           
           <AdSlot slotId="9605048985" className="mb-8" minHeight="200px" maxHeight="200px" aria-label="About header advertisement" />
           
           {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">5000+</div>
              <div className="text-sm text-gray-600">Names Researched</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-sm text-gray-600">Happy Families</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Deep Research</h3>
                <p className="text-gray-600">
                  Every name is thoroughly researched across multiple cultures, languages, and historical contexts.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Personalized Care</h3>
                <p className="text-gray-600">
                  Our consultations are tailored to your family's values and preferences.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3">Authentic Sources</h3>
                <p className="text-gray-600">
                  All information is verified through authentic religious texts and scholarly sources.
                </p>
               </div>
             </div>
           </section>
           
           <AdSlot slotId="9605048986" className="mb-8" minHeight="200px" maxHeight="200px" aria-label="About mid-content advertisement" />
           
           {/* Story Section */}
          <section className="bg-white rounded-xl p-8 sm:p-12 shadow-sm mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              My Journey
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                As-salamu alaykum! I'm Zakriya Khan, founder of NameVerse, and my passion for names began with a simple question: "What does my name really mean?" This curiosity led me on a journey through Islamic history, Arabic linguistics, and cultural anthropology.
              </p>
              <p>
                Over the years, I have built NameVerse into a trusted baby name research platform for families seeking authentic meanings, cultural context, and spiritual insight. Each name carries a story, a blessing, and a hope for the future.
              </p>
              <p className="font-semibold text-indigo-600">
                "A name is the first gift you give your child - make it meaningful."
              </p>
            </div>
          </section>

          {/* Services */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
              What I Offer
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Name Research", desc: "In-depth analysis of name meanings, origins, and cultural significance." },
                { title: "Personal Consultation", desc: "One-on-one guidance to help you choose the perfect name." },
                { title: "Cultural Context", desc: "Understanding names across Islamic, Arabic, and Urdu traditions." },
                { title: "Numerology Analysis", desc: "Discover the numerological significance and lucky elements." },
                { title: "Spiritual Guidance", desc: "Understanding the spiritual symbolism of names." },
                { title: "Family Support", desc: "Helping families find names that honor their heritage." },
              ].map((service, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
              Expert Insights on Baby Names
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                As a dedicated name meanings expert, I specialize in helping families discover the perfect baby names with deep cultural and spiritual significance. Whether you're looking for Islamic baby names, Hindu baby names, or Christian baby names, my extensive research covers meanings in Urdu, Arabic, Hindi, and English.
              </p>
              <p>
                Baby names are more than just labels – they carry powerful meanings that can influence a child's life. From Quranic names for boys and girls to Sanskrit names with Vedic origins, I provide detailed analysis of name meanings, lucky numbers, and cultural contexts. My expertise includes Muslim baby names from the Quran, ensuring authenticity and spiritual depth.
              </p>
              <p>
                For parents seeking unique baby names, I offer personalized consultations that consider family heritage, religious beliefs, and personal preferences. Whether you need baby name suggestions for a newborn boy or girl, or want to understand the meaning of names in different languages, my services cover everything from Arabic baby names to modern baby names with traditional roots.
              </p>
              <p>
                Understanding name meanings is crucial for choosing the right baby name. I help families explore Islamic names for boys, Islamic names for girls, and names from other religious traditions. My knowledge extends to name numerology, where I analyze lucky numbers and elements associated with specific names.
              </p>
              <p>
                As a name consultant, I work with families worldwide to find meaningful baby names that honor their cultural heritage. From trending baby names to classic religious names, I provide comprehensive guidance on baby name meanings, origins, and significance. My expertise in Muslim baby names, Hindu baby names, and Christian baby names ensures that every recommendation is culturally appropriate and spiritually meaningful.
              </p>
              <p>
                Baby name research is my passion, and I continuously update my knowledge base with the latest trends and traditional wisdom. Whether you're looking for baby names A to Z, specific letter-based names, or names with particular meanings, I offer expert advice to help you make an informed decision.
              </p>
             </div>
           </section>
           
           <AdSlot slotId="9605048987" className="mb-8" minHeight="200px" maxHeight="200px" aria-label="About lower content advertisement" />
           
           {/* CTA */}
           <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Find the Perfect Name?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Let's work together to discover a name that carries meaning, beauty, and blessings
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://wa.me/923497174815" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:shadow-xl transition-all"
              >
                Start Your Consultation
              </a>
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
}
