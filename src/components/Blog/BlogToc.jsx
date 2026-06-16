import Link from 'next/link';

export function slugifyHeading(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

export function getArticleToc(post) {
  const headings = [];

  post.content?.sections?.forEach((section, index) => {
    const id = slugifyHeading(section.title);
    headings.push({ id, title: section.title, level: 2, index });
    section.subsections?.forEach((subsection, subIndex) => {
      headings.push({ id: `${id}-${slugifyHeading(subsection.title)}`, title: subsection.title, level: 3, index: `${index}-${subIndex}` });
    });
  });

  return headings;
}

export default function BlogToc({ headings = [] }) {
  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
        <span className="h-2 w-2 rounded-full bg-blue-600" />
        On this page
      </div>
      <ol className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={`${heading.id}-${heading.index}`} style={{ paddingLeft: heading.level === 3 ? '1rem' : 0 }}>
            <Link href={`#${heading.id}`} className="block rounded-xl px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
              {heading.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
