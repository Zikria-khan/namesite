import dynamic from 'next/dynamic';
import HeroSection from './HeroSection';
import ContentSection from './ContentSection';
import PopularNamesSection from './PopularNamesSection';
import FaqSection from './FaqSection';
import AdBanner from '@/components/Ads/AdBanner';

const LatestArticles = dynamic(() => import('./LatestArticles'), {
  loading: () => <div className="py-16 text-center">Loading latest articles…</div>,
});

export default function HomePageClient({ latestArticles = [] }) {
  return (
    <main role="main" className="min-h-screen flex flex-col bg-[color:var(--nv-canvas)] nv-body">
      <HeroSection />
      <ContentSection />
      <AdBanner />
      <PopularNamesSection />
      <FaqSection />
      <LatestArticles articles={latestArticles} />
    </main>
  );
}
