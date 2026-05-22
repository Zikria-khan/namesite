import NameHero from './NameHero';
import Meaning from './Meaning';
import FAQ from './FAQ';
import RelatedNames from './RelatedNames';
import SitePage from '@/components/Layout/SitePage';

export default function NameDetail({ data, faqData = [], pageUrl }) {
  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Baby Names', href: '/names' },
        { label: `${data.religion || 'Names'}`, href: `/names/${(data.religion || 'islamic').toLowerCase()}` },
        { label: data.name },
      ]}
    >
      <div className="nv-stack">
        <NameHero data={data} pageUrl={pageUrl} />
        <div className="nv-stack">
          <Meaning data={data} />
          <RelatedNames data={data} />
          <FAQ faqData={faqData} name={data.name} />
        </div>
      </div>
    </SitePage>
  );
}
