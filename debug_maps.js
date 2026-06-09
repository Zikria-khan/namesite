const fs = require('fs');
const path = require('path');

const sitemapDir = 'public';
const sitemapFiles = fs.readdirSync(sitemapDir).filter(f =>
  f.startsWith('sitemap-') &&
  f.endsWith('.xml') &&
  !f.includes('sitemap-pages') &&
  !f.match(/^sitemap\.xml$/) &&
  !f.startsWith('top_')
);

console.log('Sitemap files:', sitemapFiles.length);
console.log(sitemapFiles.filter(f => f.includes('hindu')).sort());

const maps = { islamic: new Map(), christian: new Map(), hindu: new Map() };

sitemapFiles.forEach(f => {
  const m = f.match(/sitemap-(islamic|christian|hindu)-names/);
  if (!m) return;
  const religion = m[1];
  const content = fs.readFileSync(path.join(sitemapDir, f), 'utf8');
  const regex = /<loc>https?:\/\/nameverse\.vercel\.app\/names\/(islamic|christian|hindu)\/([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const slug = match[2].toLowerCase();
    if (!maps[religion].has(slug)) {
      maps[religion].set(slug, match[2]);
    }
  }
});

console.log('\nIslamic slugs:', maps.islamic.size);
console.log('Christian slugs:', maps.christian.size);
console.log('Hindu slugs:', maps.hindu.size);

// Check specific names
['krishna','adam','liam','ethan','cedar','freya','helena','jasper','marcus','morrigan','oscar','raven','sara','zara'].forEach(name => {
  const found = maps.islamic.has(name) || maps.christian.has(name) || maps.hindu.has(name);
  console.log(`Has ${name}: ${found}`);
});

// Check what actually got replaced in blog-posts-fixed.json
const posts = JSON.parse(fs.readFileSync('public/data/blog-posts-fixed.json', 'utf8'));
const hinduBlog = posts.find(p => p.id === 'hindu-vedic-naming-guide');
if (hinduBlog) {
  const boyNames = hinduBlog.content.sections.find(s => s.title.includes('Boy'));
  const girlNames = hinduBlog.content.sections.find(s => s.title.includes('Girl'));
  console.log('\nHindu boy names:', boyNames.featuredNames.join(', '));
  console.log('Hindu girl names:', girlNames.featuredNames.join(', '));
}
