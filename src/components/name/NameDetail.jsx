import NameHero from './NameHero';
import LinguisticOriginPanel from './Meaning';
import FAQ from './FAQ';
import RelatedNames from './RelatedNames';
import SitePage from '@/components/Layout/SitePage';
import AdSlot from '@/components/Ads/AdSlot';

export default function CulturalNameAnalysisCard({ data, faqData = [], pageUrl }) {
  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cultural Name Research', href: '/names' },
        { label: `${data.religion || 'Names'}`, href: `/names/${(data.religion || 'islamic').toLowerCase()}` },
        { label: data.name },
      ]}
    >
      <div className="nv-stack">
        <NameHero data={data} pageUrl={pageUrl} />
        <AdSlot slotId="9605048967" collapseOnEmpty={true} className="mb-6" minHeight="200px" maxHeight="200px" aria-label="Header advertisement" />
        <div className="nv-stack">
          <LinguisticOriginPanel data={data} />
          <AdSlot slotId="9605048968" collapseOnEmpty={true} className="mb-6" minHeight="200px" maxHeight="200px" aria-label="Middle advertisement" />
          <RelatedNames data={data} />
          <AdSlot slotId="9605048969" collapseOnEmpty={true} className="mb-6" minHeight="200px" maxHeight="200px" aria-label="Related content advertisement" />
          <FAQ faqData={faqData} name={data.name} />
          <AdSlot slotId="9605048970" collapseOnEmpty={true} className="mb-6" minHeight="200px" maxHeight="200px" aria-label="Footer advertisement" />
        </div>
      </div>
    </SitePage>
  );
}