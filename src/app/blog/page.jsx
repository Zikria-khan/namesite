import Link from 'next/link';
import { BookOpen, Heart, Clock, ArrowRight, Calendar, Award, TrendingUp, User } from 'lucide-react';
import StructuredData from '@/components/SEO/StructuredData';
import BlogImageWithFallback from '@/components/Blog/BlogImageWithFallback';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import NativeBanner from '@/components/Ads/NativeBanner';

// Static import — works on both Vercel and Cloudflare Workers (no fs needed)
import blogPostsData from '@/../public/data/blog-posts.json' with { type: 'json' };

// ISR with 90-day cache for blog index — keep content stable
export const revalidate = 31536000; // 365 days

const blogFaq = [
  { question: 'How do I choose the perfect baby name?', answer: 'Choose a baby name by balancing meaning, cultural relevance, pronunciation, and family tradition. Our guides help you compare Islamic, Christian, Hindu, and global name choices with trusted origin notes.' },
  { question: 'What are the most popular Islamic baby names?', answer: 'The most popular Islamic baby names include Muhammad, Ali, Yusuf, Aisha, Fatima, Zainab and Maryam — names with Quranic meaning and modern appeal.' },
  { question: 'What baby names are trending in 2026?', answer: 'Trending baby names for 2026 include names with spiritual meaning, short modern forms, and cross-cultural appeal such as Rayan, Noor, Elias, Leila, Vihaan, and Zara.' },
  { question: 'How important is name meaning?', answer: 'Name meaning is very important for cultural identity and long-term satisfaction; choose a name with a positive meaning that reflects your family values and heritage.' }
];

const blogCollection = {
  name: 'NameVerse Blog: Baby Names & Guides',
  description: 'Explore expert baby naming advice, trends, and naming traditions for Islamic, Christian, Hindu, and global names.',
  url: `${getSiteUrl()}/blog`,
  items: [
    { name: 'Islamic Boy Names', path: 'islamic/boy-names' },
    { name: 'Islamic Girl Names', path: 'islamic/girl-names' },
    { name: 'Christian Boy Names', path: 'christian/boy-names' },
    { name: 'Christian Girl Names', path: 'christian/girl-names' },
    { name: 'Hindu Boy Names', path: 'hindu/boy-names' },
    { name: 'Hindu Girl Names', path: 'hindu/girl-names' }
  ]
};

export const metadata = {
  title: 'Baby Names Blog & Expert Guides | Naming Tips, Trends & Advice | NameVerse',
  description: 'Expert guides and articles on choosing the perfect baby name. Learn about Islamic, Christian, and Hindu naming traditions, 2026 baby name trends, and expert naming tips.',
  keywords: 'baby names blog, naming guides, baby name trends 2026, Islamic naming guide, Christian naming guide, Hindu naming guide, how to choose baby name, baby naming tips',
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Baby Names Blog & Expert Guides | Naming Tips, Trends & Advice | NameVerse',
    description: 'Expert guides and articles on choosing the perfect baby name. Learn about Islamic, Christian, and Hindu naming traditions, 2026 baby name trends, and expert naming tips.',
    type: 'website',
    url: `${getSiteUrl()}/blog`,
    images: [`${getSiteUrl()}/opengraph-image`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Names Blog & Expert Guides | Naming Tips, Trends & Advice | NameVerse',
    description: 'Expert guides and articles on choosing the perfect baby name. Learn about Islamic, Christian, and Hindu naming traditions, 2026 baby name trends, and expert naming tips.',
    images: [`${getSiteUrl()}/opengraph-image`],
  },
};

export default function BlogPage() {
  const featuredPosts = blogPostsData.filter(p => p.featured);
  const recentPosts = blogPostsData.filter(p => !p.featured);

  return (
    <SitePage className="bg-white" containerClassName="max-w-none px-0 py-0">
      <StructuredData
        organization={true}
        website={true}
        breadcrumbs={[
          { name: 'Home', url: getSiteUrl() },
          { name: 'Blog', url: `${getSiteUrl()}/blog` }
        ]}
        collectionPage={blogCollection}
        faq={blogFaq}
      />

       {/* Hero Section - Clean & Professional */}
       <section className="py-16 px-4 bg-white border-b border-gray-200">
         <div className="max-w-6xl mx-auto">
           <nav className="mb-6 text-sm text-gray-500">
             <Link href="/" className="hover:text-gray-700">Home</Link>
             <span className="mx-2">/</span>
             <span className="text-gray-900 font-medium">Blog</span>
           </nav>
           
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
             Baby Names Blog & Expert Guides
           </h1>
           <p className="text-xl text-gray-600 max-w-2xl">
             Expert advice, naming traditions, cultural insights, and the latest trends 
             to help you choose the perfect name for your baby.
           </p>
         </div>
       </section>
       
       <NativeBanner className="my-6" minHeight="90px" instanceId="blog-index-1" />

      {/* Blog internal links */}
      <section className="py-10 px-4 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Explore name collections from every tradition</h2>
          <p className="text-gray-600 mb-6 max-w-3xl">Jump directly to curated baby name collections for Islamic, Christian, Hindu and global naming guidance. These links help readers and search engines discover key category pages quickly.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/islamic/boy-names" className="block rounded-2xl border border-indigo-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">Islamic Boy Names</h3>
              <p className="mt-2 text-sm text-gray-600">Explore Quranic, Arabic, and modern Muslim boy names with meaning and pronunciation.</p>
            </Link>
            <Link href="/islamic/girl-names" className="block rounded-2xl border border-indigo-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">Islamic Girl Names</h3>
              <p className="mt-2 text-sm text-gray-600">Discover meaningful Islamic girl names with cultural context and modern appeal.</p>
            </Link>
            <Link href="/christian/boy-names" className="block rounded-2xl border border-sky-200 bg-white p-5 hover:border-sky-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">Christian Boy Names</h3>
              <p className="mt-2 text-sm text-gray-600">Browse biblical and contemporary Christian boy names with strong spiritual meaning.</p>
            </Link>
            <Link href="/christian/girl-names" className="block rounded-2xl border border-sky-200 bg-white p-5 hover:border-sky-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">Christian Girl Names</h3>
              <p className="mt-2 text-sm text-gray-600">Find popular and timeless Christian girl names that honor faith and family heritage.</p>
            </Link>
            <Link href="/hindu/boy-names" className="block rounded-2xl border border-amber-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">Hindu Boy Names</h3>
              <p className="mt-2 text-sm text-gray-600">Explore Sanskrit, Vedic, and devotional boy names for modern Hindu families.</p>
            </Link>
            <Link href="/hindu/girl-names" className="block rounded-2xl border border-amber-200 bg-white p-5 hover:border-amber-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">Hindu Girl Names</h3>
              <p className="mt-2 text-sm text-gray-600">Discover beautiful Hindu girl names with meanings rooted in myth, nature, and virtue.</p>
            </Link>
            <Link href="/names/religion/islamic/1" className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">All Islamic Names</h3>
              <p className="mt-2 text-sm text-gray-600">Browse the complete Islamic names collection, all paginated and fully searchable.</p>
            </Link>
            <Link href="/names/religion/christian/1" className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">All Christian Names</h3>
              <p className="mt-2 text-sm text-gray-600">Access the full Christian names directory with meanings, origins, and filters.</p>
            </Link>
            <Link href="/names/religion/hindu/1" className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition">
              <h3 className="font-semibold text-gray-900">All Hindu Names</h3>
              <p className="mt-2 text-sm text-gray-600">Explore the full Hindu names collection, searchable by origin, gender, and letter.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* REVENUE BANNERS — center of blog index content */}


      {/* Featured Articles */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Guides</h2>
          
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => {
              const imageUrl = post.featuredImage ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${getSiteUrl()}${post.featuredImage}`) : `${getSiteUrl()}/opengraph-image`;
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <BlogImageWithFallback
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      containerClassName="h-full w-full"
                    >
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    </BlogImageWithFallback>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
            </div>
          </div>
        </section>

      {/* Browse Names Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Names by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/islamic/boy-names"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Islamic Boy Names</h3>
              <p className="text-sm text-gray-500">150+ names</p>
            </Link>
            <Link 
              href="/islamic/girl-names"
              className="p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Islamic Girl Names</h3>
              <p className="text-sm text-gray-500">200+ names</p>
            </Link>
            <Link 
              href="/christian/boy-names"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Christian Boy Names</h3>
              <p className="text-sm text-gray-500">100+ names</p>
            </Link>
            <Link 
              href="/christian/girl-names"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Christian Girl Names</h3>
              <p className="text-sm text-gray-500">100+ names</p>
            </Link>
          </div>
        </div>
      </section>

      {/* More Articles */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
          
           <div className="space-y-4">
            {recentPosts.map((post) => {
              const imageUrl = post.featuredImage ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${getSiteUrl()}${post.featuredImage}`) : `${getSiteUrl()}/opengraph-image`;
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <BlogImageWithFallback
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By {post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="flex-shrink-0 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      aria-label={`Read more about ${post.title}`}
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
       </section>
 
       <NativeBanner className="my-6" minHeight="90px" instanceId="blog-index-2" />
 
       {/* FAQ Section */}
       <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogFaq.map((item, index) => (
              <div key={index} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
         </div>
       </section>
 
       <NativeBanner className="my-6" minHeight="90px" instanceId="blog-index-3" />
 
       {/* CTA Section */}
       <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find the Perfect Name?
          </h2>
          <p className="text-gray-600 mb-8">
            Explore our database of 60,000+ baby names with detailed meanings and origins.
          </p>
          <Link
            href="/names/religion/islamic/1"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Heart className="w-5 h-5" />
            Browse All Names
          </Link>
        </div>
      </section>
    </SitePage>
  );
}
